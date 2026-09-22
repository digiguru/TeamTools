export type ModelType = "comfort" | "tuckman";

export interface VotePoint {
  x: number;
  y: number;
}

export interface RevealedVote extends VotePoint {
  mine?: boolean;
}

export interface RoomSummary {
  id: string;
  name: string;
  model: ModelType;
  status: "open" | "revealed";
  createdAt: number;
  updatedAt: number;
  savedVoteCount?: number;
}

export interface RoomSnapshot {
  type: "snapshot";
  room: RoomSummary;
  isHost: boolean;
  myVote: VotePoint | null;
  joinedCount: number;
  votedCount: number;
  votes: RevealedVote[];
}

export interface SavedRoom {
  id: string;
  name: string;
  model: ModelType;
  createdAt: number;
  updatedAt: number;
  votes: VotePoint[];
}

const HOST_TOKEN_KEY = "teamtools-host-token";
const VOTER_KEY_PREFIX = "teamtools-voter:";
const SAVED_ROOMS_KEY = "teamtools-saved-rooms-v1";

function randomToken() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID().replace(/-/g, "");
  }
  const bytes = new Uint8Array(24);
  globalThis.crypto?.getRandomValues?.(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getOrCreate(key: string) {
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const value = randomToken();
  localStorage.setItem(key, value);
  return value;
}

export function getHostToken() {
  return getOrCreate(HOST_TOKEN_KEY);
}

export function getVoterId(roomId: string) {
  return getOrCreate(`${VOTER_KEY_PREFIX}${roomId}`);
}

export function readSavedRooms(): SavedRoom[] {
  try {
    const value = JSON.parse(localStorage.getItem(SAVED_ROOMS_KEY) || "[]");
    if (!Array.isArray(value)) return [];
    return value
      .filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          (item.model === "comfort" || item.model === "tuckman"),
      )
      .slice(0, 50);
  } catch {
    return [];
  }
}

export function writeSavedRooms(rooms: SavedRoom[]) {
  localStorage.setItem(SAVED_ROOMS_KEY, JSON.stringify(rooms.slice(0, 50)));
}

export function upsertSavedRoom(room: SavedRoom) {
  const existing = readSavedRooms();
  const next = [room, ...existing.filter((item) => item.id !== room.id)]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 50);
  writeSavedRooms(next);
  return room;
}

export function replaceSavedRoomId(oldId: string, room: RoomSummary) {
  const saved = readSavedRooms();
  const previous = saved.find((item) => item.id === oldId);
  if (!previous) return;
  upsertSavedRoom({
    ...previous,
    id: room.id,
    name: room.name,
    model: room.model,
    updatedAt: room.updatedAt,
  });
  if (oldId !== room.id) {
    writeSavedRooms(readSavedRooms().filter((item) => item.id !== oldId));
  }
}

export function saveRoomSnapshot(snapshot: RoomSnapshot) {
  const previous = readSavedRooms().find((item) => item.id === snapshot.room.id);
  const revealedVotes =
    snapshot.room.status === "revealed"
      ? snapshot.votes.map(({ x, y }) => ({ x, y }))
      : previous?.votes || [];

  return upsertSavedRoom({
    id: snapshot.room.id,
    name: snapshot.room.name,
    model: snapshot.room.model,
    createdAt: snapshot.room.createdAt,
    updatedAt: snapshot.room.updatedAt,
    votes: revealedVotes,
  });
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json");
  headers.set("authorization", `Bearer ${getHostToken()}`);
  const response = await fetch(path, { ...init, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || `Request failed (${response.status})`);
  }
  return payload as T;
}

export function roomIdFromLocation() {
  return (
    window.location.pathname
      .match(/^\/room\/([a-z0-9-]{3,64})\/?$/i)?.[1]
      ?.toLowerCase() || null
  );
}

export function roomWebSocketUrl(roomId: string) {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const params = new URLSearchParams({
    roomId,
    voterId: getVoterId(roomId),
  });
  return `${protocol}//${window.location.host}/api/live?${params}`;
}
