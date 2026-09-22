import { randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocket, WebSocketServer } from "ws";

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const dev = process.env.TEAMTOOLS_DEV === "1";
const rootDir = resolve(fileURLToPath(new URL("./", import.meta.url)));
const distDir = resolve(rootDir, "dist");
const rooms = new Map();
const MODEL_TYPES = new Set(["comfort", "tuckman"]);
const MAX_ROOMS_PER_HOST = 30;
const MAX_BODY_BYTES = 16 * 1024;

const adjectives = ["bright", "brave", "calm", "curious", "electric", "gentle", "lively", "lucid", "mighty", "nimble", "open", "quiet", "rapid", "steady", "stellar", "vivid"];
const nouns = ["beacon", "comet", "constellation", "harbour", "horizon", "lantern", "meadow", "meteor", "nexus", "orbit", "pulse", "signal", "spark", "voyager", "wave", "workshop"];

function tokenIsValid(value) {
  return typeof value === "string" && /^[a-f0-9]{32,128}$/i.test(value);
}

function cleanRoomName(value) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
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

function bearerToken(request) {
  const authorization = request.headers.authorization || "";
  const match = /^Bearer\s+(.+)$/i.exec(authorization);
  return match?.[1] || "";
}

async function readJson(request) {
  let total = 0;
  const chunks = [];
  for await (const chunk of request) {
    total += chunk.length;
    if (total > MAX_BODY_BYTES) throw new Error("Request too large");
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function securityHeaders(extra = {}) {
  return {
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "x-frame-options": "DENY",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    ...extra,
  };
}

function writeJson(response, status, payload) {
  response.writeHead(status, securityHeaders({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  }));
  response.end(JSON.stringify(payload));
}

function publicRoom(room) {
  return {
    id: room.id,
    name: room.name,
    model: room.model,
    status: room.status,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
  };
}

function connectedAttendeeCount(room) {
  const ids = new Set();
  for (const connection of room.connections) {
    if (!connection.isHost && connection.ws.readyState === WebSocket.OPEN) {
      ids.add(connection.voterId);
    }
  }
  return ids.size;
}

function snapshotFor(room, connection) {
  const myVote = connection.isHost ? null : room.votes.get(connection.voterId) || null;
  const votes = room.status === "revealed"
    ? [...room.votes.entries()].map(([voterId, vote]) => ({
        ...vote,
        mine: !connection.isHost && voterId === connection.voterId,
      }))
    : [];

  return {
    type: "snapshot",
    room: publicRoom(room),
    isHost: connection.isHost,
    myVote,
    joinedCount: connectedAttendeeCount(room),
    votedCount: room.votes.size,
    votes,
  };
}

function send(connection, message) {
  if (connection.ws.readyState === WebSocket.OPEN) {
    connection.ws.send(JSON.stringify(message));
  }
}

function broadcast(room) {
  for (const connection of room.connections) {
    send(connection, snapshotFor(room, connection));
  }
}

function ownedRoomCount(hostToken) {
  let count = 0;
  for (const room of rooms.values()) {
    if (room.hostToken === hostToken) count += 1;
  }
  return count;
}

function validVote(vote) {
  return vote &&
    Number.isFinite(vote.x) &&
    Number.isFinite(vote.y) &&
    vote.x >= 0 &&
    vote.x <= 1 &&
    vote.y >= 0 &&
    vote.y <= 1;
}

async function handleApi(request, response, url) {
  if (request.method === "POST" && url.pathname === "/api/rooms") {
    const hostToken = bearerToken(request);
    if (!tokenIsValid(hostToken)) {
      return writeJson(response, 401, { error: "A valid host token is required." });
    }
    if (ownedRoomCount(hostToken) >= MAX_ROOMS_PER_HOST) {
      return writeJson(response, 409, { error: "This browser already hosts the maximum number of rooms." });
    }

    let body;
    try {
      body = await readJson(request);
    } catch {
      return writeJson(response, 400, { error: "Invalid room request." });
    }

    const name = cleanRoomName(body.name);
    const model = typeof body.model === "string" ? body.model.toLowerCase() : "";
    if (!name) {
      return writeJson(response, 400, { error: "Give the room a name." });
    }
    if (!MODEL_TYPES.has(model)) {
      return writeJson(response, 400, { error: "Choose a supported model." });
    }

    const now = Date.now();
    const room = {
      id: makeRoomId(),
      name,
      model,
      hostToken,
      status: "open",
      createdAt: now,
      updatedAt: now,
      votes: new Map(),
      connections: new Set(),
    };
    rooms.set(room.id, room);
    return writeJson(response, 201, { room: publicRoom(room) });
  }

  const match = /^\/api\/rooms\/([a-z0-9-]{3,64})$/i.exec(url.pathname);
  if (request.method === "GET" && match) {
    const room = rooms.get(match[1].toLowerCase());
    if (!room) {
      return writeJson(response, 404, {
        error: "Room not found. It may have expired after a deployment.",
      });
    }
    return writeJson(response, 200, { room: publicRoom(room) });
  }

  return false;
}

const mime = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".ico", "image/x-icon"],
  [".json", "application/json; charset=utf-8"],
]);

async function serveProduction(request, response, url) {
  if (request.method !== "GET" && request.method !== "HEAD") return false;

  let relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  if (!relative || relative.startsWith("room/")) relative = "index.html";

  const candidate = resolve(distDir, relative);
  if (!(candidate === distDir || candidate.startsWith(distDir + sep))) {
    return false;
  }

  let file = candidate;
  try {
    const info = await stat(file);
    if (info.isDirectory()) file = resolve(file, "index.html");
  } catch {
    file = resolve(distDir, "index.html");
  }

  try {
    const body = await readFile(file);
    response.writeHead(200, securityHeaders({
      "content-type": mime.get(extname(file)) || "application/octet-stream",
      "cache-control": extname(file) === ".html"
        ? "no-store"
        : "public, max-age=31536000, immutable",
    }));
    if (request.method === "HEAD") response.end();
    else response.end(body);
    return true;
  } catch {
    return false;
  }
}

let vite = null;
if (dev) {
  const { createServer: createViteServer } = await import("vite");
  vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
}

const server = createServer(async (request, response) => {
  const url = new URL(
    request.url || "/",
    `http://${request.headers.host || "localhost"}`,
  );

  const handled = await handleApi(request, response, url);
  if (handled !== false) return;

  if (vite) {
    vite.middlewares(request, response, () => {
      if (!response.writableEnded) {
        writeJson(response, 404, { error: "Not found." });
      }
    });
    return;
  }

  if (await serveProduction(request, response, url)) return;
  writeJson(response, 404, { error: "Not found." });
});

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  const url = new URL(
    request.url || "/",
    `http://${request.headers.host || "localhost"}`,
  );
  if (url.pathname !== "/ws") return socket.destroy();

  const origin = request.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.host) return socket.destroy();
    } catch {
      return socket.destroy();
    }
  }

  const roomId = (url.searchParams.get("roomId") || "").toLowerCase();
  const voterId = url.searchParams.get("voterId") || "";
  if (!rooms.has(roomId) || !tokenIsValid(voterId)) return socket.destroy();

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, { roomId, voterId });
  });
});

wss.on("connection", (ws, context) => {
  const room = rooms.get(context.roomId);
  if (!room) return ws.close(4004, "Room not found");

  const connection = {
    ws,
    voterId: context.voterId,
    isHost: false,
  };

  room.connections.add(connection);
  send(connection, snapshotFor(room, connection));
  broadcast(room);

  ws.on("message", (raw) => {
    let message;
    try {
      message = JSON.parse(raw.toString());
    } catch {
      return send(connection, { type: "error", error: "Invalid message." });
    }

    if (message.type === "authenticate-host") {
      if (
        tokenIsValid(message.hostToken) &&
        message.hostToken === room.hostToken
      ) {
        connection.isHost = true;
        broadcast(room);
      }
      return;
    }

    if (message.type === "vote") {
      if (connection.isHost) {
        return send(connection, {
          type: "error",
          error: "Hosts facilitate this round rather than voting.",
        });
      }
      if (room.status !== "open") {
        return send(connection, {
          type: "error",
          error: "Voting is closed because the room has been revealed.",
        });
      }
      if (!validVote(message.vote)) {
        return send(connection, {
          type: "error",
          error: "That vote is outside the model.",
        });
      }

      room.votes.set(connection.voterId, {
        x: Number(message.vote.x),
        y: Number(message.vote.y),
      });
      room.updatedAt = Date.now();
      broadcast(room);
      return;
    }

    if (message.type === "reveal") {
      if (!connection.isHost) {
        return send(connection, {
          type: "error",
          error: "Only the host can reveal the room.",
        });
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

server.listen(port, host, () => {
  console.log(
    `TeamTools listening on http://${host}:${port}${dev ? " (Vite middleware)" : ""}`,
  );
});
