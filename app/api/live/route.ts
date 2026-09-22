import { randomBytes } from "node:crypto";
import {
  experimental_upgradeWebSocket,
  type WebSocketData,
} from "@vercel/functions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ModelType = "comfort" | "tuckman";
type RoomStatus = "open" | "revealed";
type VotePoint = { x: number; y: number };

type LiveSocket = {
  send(message: string): void;
  on(event: "message", listener: (data: WebSocketData) => void): void;
  on(event: "close", listener: () => void): void;
};

type Connection = {
  ws: LiveSocket;
  voterId: string;
  isHost: boolean;
};

type Room = {
  id: string;
  name: string;
  model: ModelType;
  hostToken: string;
  status: RoomStatus;
  createdAt: number;
  updatedAt: number;
  votes: Map<string, VotePoint>;
  baselineVotes: VotePoint[];
  connections: Set<Connection>;
};

declare global {
  var __teamToolsRooms: Map<string, Room> | undefined;
}

const rooms = globalThis.__teamToolsRooms ?? new Map<string, Room>();
globalThis.__teamToolsRooms = rooms;

const MODEL_TYPES = new Set<ModelType>(["comfort", "tuckman"]);
const MAX_ROOMS_PER_HOST = 30;

const adjectives = [
  "bright","brave","calm","curious","electric","gentle","lively","lucid",
  "mighty","nimble","open","quiet","rapid","steady","stellar","vivid",
];

const nouns = [
  "beacon","comet","constellation","harbour","horizon","lantern","meadow","meteor",
  "nexus","orbit","pulse","signal","spark","voyager","wave","workshop",
];

function tokenIsValid(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{32,128}$/i.test(value);
}

function roomIdIsValid(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9-]{3,64}$/i.test(value);
}

function cleanRoomName(value: unknown) {
  if (typeof value !== "string") return "";
  return [...value]
    .map((character) => {
      const code = character.charCodeAt(0);
      return code <= 31 || code === 127 ? " " : character;
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function makeRoomId() {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const bytes = randomBytes(5);
    const adjective = adjectives[bytes[0] % adjectives.length];
    const noun = nouns[bytes[1] % nouns.length];
    const suffix = (bytes.readUIntBE(2, 3) % 9000) + 1000;
    const id = `${adjective}-${noun}-${suffix}`;
    if (!rooms.has(id)) return id;
  }
  return randomBytes(8).toString("hex");
}

function bearerToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const match = /^Bearer\s+(.+)$/i.exec(authorization);
  return match?.[1] || "";
}

function publicRoom(room: Room) {
  return {
    id: room.id,
    name: room.name,
    model: room.model,
    status: room.status,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    savedVoteCount: room.baselineVotes.length,
  };
}

function ownedRoomCount(hostToken: string) {
  let count = 0;
  for (const room of rooms.values()) {
    if (room.hostToken === hostToken) count += 1;
  }
  return count;
}

function connectedAttendeeCount(room: Room) {
  const ids = new Set<string>();
  for (const connection of room.connections) {
    if (!connection.isHost) ids.add(connection.voterId);
  }
  return ids.size;
}

function validVote(vote: unknown): vote is VotePoint {
  if (!vote || typeof vote !== "object") return false;
  const candidate = vote as VotePoint;
  return (
    Number.isFinite(candidate.x) &&
    Number.isFinite(candidate.y) &&
    candidate.x >= 0 &&
    candidate.x <= 1 &&
    candidate.y >= 0 &&
    candidate.y <= 1
  );
}

function cleanSavedVotes(input: unknown) {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 5000).filter(validVote).map((vote) => ({
    x: Number(vote.x),
    y: Number(vote.y),
  }));
}

function snapshotFor(room: Room, connection: Connection) {
  const myVote = connection.isHost
    ? null
    : room.votes.get(connection.voterId) || null;

  const votes =
    room.status === "revealed"
      ? [
          ...room.baselineVotes.map((vote) => ({ ...vote, mine: false })),
          ...[...room.votes.entries()].map(([voterId, vote]) => ({
            ...vote,
            mine: !connection.isHost && voterId === connection.voterId,
          })),
        ]
      : [];

  return {
    type: "snapshot",
    room: publicRoom(room),
    isHost: connection.isHost,
    myVote,
    joinedCount: room.baselineVotes.length + connectedAttendeeCount(room),
    votedCount: room.baselineVotes.length + room.votes.size,
    votes,
  };
}

function send(connection: Connection, message: unknown) {
  try {
    connection.ws.send(JSON.stringify(message));
  } catch {
    roomCleanup(connection);
  }
}

function roomCleanup(connection: Connection) {
  for (const room of rooms.values()) {
    if (room.connections.delete(connection)) return;
  }
}

function broadcast(room: Room) {
  for (const connection of [...room.connections]) {
    send(connection, snapshotFor(room, connection));
  }
}

function webSocketText(data: WebSocketData) {
  if (typeof data === "string") return data;
  if (Buffer.isBuffer(data)) return data.toString("utf8");
  if (data instanceof ArrayBuffer) return Buffer.from(data).toString("utf8");
  if (Array.isArray(data)) return Buffer.concat(data).toString("utf8");
  return String(data);
}

export async function POST(request: Request) {
  const hostToken = bearerToken(request);
  if (!tokenIsValid(hostToken)) {
    return Response.json({ error: "A valid host token is required." }, { status: 401 });
  }

  let body: {
    action?: string;
    name?: string;
    model?: string;
    snapshot?: {
      id?: string;
      name?: string;
      model?: string;
      createdAt?: number;
      votes?: unknown;
    };
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid room request." }, { status: 400 });
  }

  if (body.action === "restore") {
    const saved = body.snapshot || {};
    const oldId = String(saved.id || "").toLowerCase();
    const name = cleanRoomName(saved.name);
    const model = String(saved.model || "").toLowerCase() as ModelType;
    const baselineVotes = cleanSavedVotes(saved.votes);

    if (!roomIdIsValid(oldId) || !name || !MODEL_TYPES.has(model)) {
      return Response.json({ error: "Saved room data is incomplete." }, { status: 400 });
    }

    const existing = rooms.get(oldId);
    if (existing) {
      if (existing.hostToken !== hostToken) {
        return Response.json(
          { error: "This room belongs to a different host browser." },
          { status: 403 },
        );
      }
      existing.status = "open";
      existing.updatedAt = Date.now();
      broadcast(existing);
      return Response.json(
        { room: publicRoom(existing), restored: false },
        { status: 200 },
      );
    }

    if (ownedRoomCount(hostToken) >= MAX_ROOMS_PER_HOST) {
      return Response.json(
        { error: "This browser already hosts the maximum number of rooms." },
        { status: 409 },
      );
    }

    const now = Date.now();
    const room: Room = {
      id: makeRoomId(),
      name,
      model,
      hostToken,
      status: "open",
      createdAt: Number.isFinite(saved.createdAt) ? Number(saved.createdAt) : now,
      updatedAt: now,
      votes: new Map(),
      baselineVotes,
      connections: new Set(),
    };
    rooms.set(room.id, room);
    return Response.json(
      {
        room: publicRoom(room),
        restored: true,
        replacedRoomId: oldId,
      },
      { status: 201 },
    );
  }

  if (ownedRoomCount(hostToken) >= MAX_ROOMS_PER_HOST) {
    return Response.json(
      { error: "This browser already hosts the maximum number of rooms." },
      { status: 409 },
    );
  }

  const name = cleanRoomName(body.name);
  const model = String(body.model || "").toLowerCase() as ModelType;

  if (!name) {
    return Response.json({ error: "Give the room a name." }, { status: 400 });
  }

  if (!MODEL_TYPES.has(model)) {
    return Response.json({ error: "Choose a supported model." }, { status: 400 });
  }

  const now = Date.now();
  const room: Room = {
    id: makeRoomId(),
    name,
    model,
    hostToken,
    status: "open",
    createdAt: now,
    updatedAt: now,
    votes: new Map(),
    baselineVotes: [],
    connections: new Set(),
  };

  rooms.set(room.id, room);
  return Response.json({ room: publicRoom(room) }, { status: 201 });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const roomId = (url.searchParams.get("roomId") || "").toLowerCase();

  if (!roomId) {
    const hostToken = bearerToken(request);
    if (!tokenIsValid(hostToken)) {
      return Response.json({ error: "A valid host token is required." }, { status: 401 });
    }
    const ownedRooms = [...rooms.values()]
      .filter((room) => room.hostToken === hostToken)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map(publicRoom);
    return Response.json({ rooms: ownedRooms }, { status: 200 });
  }

  const room = rooms.get(roomId);

  if (url.searchParams.get("check") === "1") {
    return room
      ? Response.json({ room: publicRoom(room) }, { status: 200 })
      : Response.json(
          { error: "Room not found. It may have expired after a deployment." },
          { status: 404 },
        );
  }

  const voterId = url.searchParams.get("voterId") || "";

  if (!room || !tokenIsValid(voterId)) {
    return Response.json(
      {
        error: room
          ? "A valid anonymous voter id is required."
          : "Room not found. It may have expired after a deployment.",
      },
      { status: room ? 400 : 404 },
    );
  }

  return experimental_upgradeWebSocket((ws) => {
    const connection: Connection = { ws, voterId, isHost: false };

    room.connections.add(connection);
    send(connection, snapshotFor(room, connection));
    broadcast(room);

    ws.on("message", (raw: WebSocketData) => {
      let message: {
        type?: string;
        hostToken?: unknown;
        vote?: unknown;
      };
      try {
        message = JSON.parse(webSocketText(raw)) as typeof message;
      } catch {
        send(connection, { type: "error", error: "Invalid message." });
        return;
      }

      if (message.type === "authenticate-host") {
        if (tokenIsValid(message.hostToken) && message.hostToken === room.hostToken) {
          connection.isHost = true;
          broadcast(room);
        }
        return;
      }

      if (message.type === "vote") {
        if (connection.isHost) {
          send(connection, {
            type: "error",
            error: "Hosts facilitate this round rather than voting.",
          });
          return;
        }

        if (room.status !== "open") {
          send(connection, {
            type: "error",
            error: "Voting is closed because the room has been revealed.",
          });
          return;
        }

        if (!validVote(message.vote)) {
          send(connection, {
            type: "error",
            error: "That vote is outside the model.",
          });
          return;
        }

        room.votes.set(connection.voterId, {
          x: Number((message.vote as VotePoint).x),
          y: Number((message.vote as VotePoint).y),
        });
        room.updatedAt = Date.now();
        broadcast(room);
        return;
      }

      if (message.type === "reveal") {
        if (!connection.isHost) {
          send(connection, {
            type: "error",
            error: "Only the host can reveal the room.",
          });
          return;
        }

        if (room.status === "open") {
          room.status = "revealed";
          room.updatedAt = Date.now();
          broadcast(room);
        }
      }
    });

    ws.on("close", () => {
      room.connections.delete(connection);
      broadcast(room);
    });
  });
}
