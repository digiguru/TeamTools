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

const HOST_TOKEN_KEY = "teamtools-host-token";
const VOTER_KEY_PREFIX = "teamtools-voter:";

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
