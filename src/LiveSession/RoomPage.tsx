"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRealtimeSessionClient } from "@digiguru/live-session/browser";
import { animateFlip, captureRect } from "@digiguru/spacial-stage";
import { trackTeamToolsEvent } from "../Analytics/client";
import { ModelVisual } from "./ModelVisual";
import {
  getHostToken,
  getVoterId,
  saveRoomSnapshot,
  type RoomSnapshot,
  type VotePoint,
} from "./realtime";
import { MODEL_COPY } from "./modelCopy";

function ShareButton({ roomId }: { roomId: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = `${window.location.origin}/room/${roomId}`;
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button className="button button--secondary" onClick={copy}>
      {copied ? "Copied" : "Copy attendee link"}
    </button>
  );
}

export function RoomPage({ roomId }: { roomId: string }) {
  const [snapshot, setSnapshot] = useState<RoomSnapshot | null>(null);
  const [connection, setConnection] = useState<"connecting" | "live" | "offline">(
    "connecting",
  );
  const [error, setError] = useState("");
  const [roomMissing, setRoomMissing] = useState(false);
  const clientRef = useRef<ReturnType<typeof createRealtimeSessionClient> | null>(null);
  const reconnectRef = useRef<number | null>(null);
  const unmountedRef = useRef(false);
  const displayedRef = useRef(false);
  const autosaveRef = useRef<number | null>(null);
  const roomControlsRef = useRef<HTMLElement | null>(null);
  const spatialEntrancePlayedRef = useRef(false);
  const [saved, setSaved] = useState(false);

  const connect = useCallback(async () => {
    if (
      unmountedRef.current ||
      (clientRef.current?.socket && clientRef.current.socket.readyState <= WebSocket.OPEN)
    ) {
      return;
    }

    setConnection("connecting");

    try {
      const response = await fetch(
        `/api/live?roomId=${encodeURIComponent(roomId)}&check=1`,
        { cache: "no-store" },
      );
      if (response.status === 404) {
        setRoomMissing(true);
        setConnection("offline");
        setError("");
        return;
      }
      if (!response.ok) {
        throw new Error(`Room check failed (${response.status})`);
      }
    } catch {
      if (!unmountedRef.current) {
        setConnection("offline");
        reconnectRef.current = window.setTimeout(connect, 1200);
      }
      return;
    }

    if (unmountedRef.current) return;

    const client = createRealtimeSessionClient({
      sessionId: roomId,
      participantId: getVoterId(roomId),
      hostCredential: getHostToken(),
      websocketPath: "/api/live",
      queryNames: { session: "roomId", participant: "voterId" },
      hostAuthMessage: (credential) => ({
        type: "authenticate-host",
        hostToken: credential,
      }),
      onConnectionState: (state) => {
        if (state === "is-live") {
          trackTeamToolsEvent("Room Connected");
          setConnection("live");
          setError("");
          return;
        }
        if (state === "is-offline") {
          setConnection("offline");
          return;
        }
        setConnection("connecting");
      },
      onMessage: (message) => {
        if (!message || typeof message !== "object") return;
        const payload = message as { type?: string; error?: string };
        if (payload.type === "snapshot") {
          const nextSnapshot = message as RoomSnapshot;
          if (!displayedRef.current) {
            displayedRef.current = true;
            trackTeamToolsEvent("Room Displayed", {
              model: nextSnapshot.room.model,
              role: nextSnapshot.isHost ? "host" : "attendee",
              status: nextSnapshot.room.status,
            });
          }
          setSnapshot(nextSnapshot);
          if (nextSnapshot.isHost) {
            if (autosaveRef.current) window.clearTimeout(autosaveRef.current);
            autosaveRef.current = window.setTimeout(() => {
              saveRoomSnapshot(nextSnapshot);
            }, 800);
          }
          return;
        }
        if (payload.type === "error") {
          setError(payload.error || "Something went wrong.");
        }
      },
      shouldReconnectAfterClose: (event) => {
        if (event.code === 4004) {
          setRoomMissing(true);
          setConnection("offline");
          setError("");
          return false;
        }
        return !unmountedRef.current;
      },
    });

    clientRef.current = client;
    client.connect();
  }, [roomId]);

  useEffect(() => {
    unmountedRef.current = false;
    connect();

    return () => {
      unmountedRef.current = true;
      if (reconnectRef.current) {
        window.clearTimeout(reconnectRef.current);
      }
      if (autosaveRef.current) {
        window.clearTimeout(autosaveRef.current);
      }
      clientRef.current?.stopReconnect();
      clientRef.current?.socket?.close(1000, "Client navigation");
      clientRef.current = null;
    };
  }, [connect]);

  useEffect(() => {
    const element = roomControlsRef.current;
    if (!snapshot || !element || spatialEntrancePlayedRef.current) return;

    const destination = captureRect(element);
    if (!destination) return;

    spatialEntrancePlayedRef.current = true;
    const source = {
      ...destination,
      left: destination.left + 48,
      right: destination.right + 48,
    };

    void animateFlip(element, source, destination, {
      duration: 420,
      easing: "cubic-bezier(.2,.82,.24,1)",
      origin: "top left",
    });
  }, [snapshot]);

  const send = (message: unknown) => {
    clientRef.current?.send(message);
  };

  const castVote = (vote: VotePoint) => {
    if (!snapshot || snapshot.isHost || snapshot.room.status !== "open") {
      return;
    }
    const changed = Boolean(snapshot.myVote);
    setSnapshot({ ...snapshot, myVote: vote });
    send({ type: "vote", vote });
    trackTeamToolsEvent("Vote Cast", { model: snapshot.room.model, changed });
  };

  const reveal = () => send({ type: "reveal" });
  const saveNow = () => {
    if (!snapshot?.isHost) return;
    saveRoomSnapshot(snapshot);
    setSaved(true);
    trackTeamToolsEvent("Room Saved", {
      model: snapshot.room.model,
      revealed: snapshot.room.status === "revealed",
    });
    window.setTimeout(() => setSaved(false), 1500);
  };
  const modelCopy = snapshot ? MODEL_COPY[snapshot.room.model] : null;
  const percent =
    snapshot && snapshot.joinedCount > 0
      ? Math.round((snapshot.votedCount / snapshot.joinedCount) * 100)
      : 0;
  const isRevealed = snapshot?.room.status === "revealed";

  const roomInstruction = useMemo(() => {
    if (!snapshot) return "Connecting to the room…";
    if (snapshot.isHost && !isRevealed) {
      return "Share the link, watch the counts, then reveal when the room is ready.";
    }
    if (snapshot.isHost && isRevealed) {
      return "Votes revealed. Use the shape as a conversation starter, not a scorecard.";
    }
    if (isRevealed) {
      return "The room has been revealed. Your point is highlighted.";
    }
    if (snapshot.myVote) {
      return "Your vote is in. You can move it until the host reveals the room.";
    }
    return "Place yourself on the model. Your choice stays private until reveal.";
  }, [snapshot, isRevealed]);

  if (roomMissing && !snapshot) {
    return (
      <main className="room-loading">
        <span className="eyebrow">Room unavailable</span>
        <h1>This room is no longer live.</h1>
        <p>
          The server no longer remembers this room. If you are the host and saved it
          in this browser, you can restore it from your Team Tools dashboard.
        </p>
        <a className="button button--primary room-loading__action" href="/">
          Go to Team Tools
        </a>
      </main>
    );
  }

  if (connection === "offline" && !snapshot) {
    return (
      <main className="room-loading">
        <h1>Reconnecting…</h1>
        <p>The room server is temporarily unavailable.</p>
      </main>
    );
  }

  return (
    <main className="room-page">
      <header className="room-header">
        <div>
          <a className="brand-link" href="/">
            Team Tools
          </a>
          <span className="eyebrow">
            {snapshot?.isHost ? "Host view" : "Anonymous attendee"}
          </span>
          <h1>{snapshot?.room.name || "Joining room…"}</h1>
          <p>
            {modelCopy?.title || "Live team model"} ·{" "}
            <span className={`connection-dot connection-dot--${connection}`}>
              {connection}
            </span>
          </p>
        </div>
        {snapshot?.isHost && (
          <div className="room-header-actions">
            <button className="button button--secondary" onClick={saveNow}>
              {saved ? "Saved" : "Save room"}
            </button>
            <ShareButton roomId={roomId} />
          </div>
        )}
      </header>

      <section className="room-model-stage" aria-label="Live team model">      </section>

      <section className="room-metrics" aria-label="Room participation">
        <div>
          <span className="metric-value">{snapshot?.joinedCount ?? "—"}</span>
          <span>joined</span>
        </div>
        <div>
          <span className="metric-value">{snapshot?.votedCount ?? "—"}</span>
          <span>voted</span>
        </div>
        <div>
          <span className="metric-value">{snapshot ? `${percent}%` : "—"}</span>
          <span>ready</span>
        </div>
        <div className={`reveal-state ${isRevealed ? "reveal-state--on" : ""}`}>
          <span className="metric-value">{isRevealed ? "Visible" : "Hidden"}</span>
          <span>votes</span>
        </div>
      </section>

      <section className="room-controls" ref={roomControlsRef}>
        <div className="room-copy">
          <span className="step-number">
            {isRevealed ? "REVEAL" : snapshot?.isHost ? "HOST" : "VOTE"}
          </span>
          <h2>{roomInstruction}</h2>
          <p>{modelCopy?.detail}</p>

          {!snapshot?.isHost && !isRevealed && (
            <div className="privacy-note">
              No names. No profiles. One current vote per browser.
            </div>
          )}

          {snapshot?.isHost && !isRevealed && (
            <div className="host-actions">
              <button
                className="button button--reveal"
                disabled={!snapshot.votedCount}
                onClick={reveal}
              >
                Reveal {snapshot.votedCount || ""} vote
                {snapshot.votedCount === 1 ? "" : "s"}
              </button>
              <small>
                Reveal freezes this round so nobody can shift after seeing the group.
              </small>
            </div>
          )}
        </div>

        <ModelVisual
          model={snapshot?.room.model || "comfort"}
          vote={snapshot?.isHost ? null : snapshot?.myVote || null}
          revealedVotes={snapshot?.votes || []}
          interactive={Boolean(
            snapshot && !snapshot.isHost && snapshot.room.status === "open",
          )}
          onVote={castVote}
        />
      </section>

      {snapshot && !snapshot.isHost && !isRevealed && (
        <footer className="waiting-bar">
          <span
            className={`waiting-check ${snapshot.myVote ? "waiting-check--done" : ""}`}
          >
            {snapshot.myVote ? "✓" : "•"}
          </span>
          <strong>{snapshot.myVote ? "Vote received" : "Waiting for your vote"}</strong>
          <span>
            {snapshot.votedCount} of {snapshot.joinedCount} attendee
            {snapshot.joinedCount === 1 ? "" : "s"} voted
          </span>
        </footer>
      )}

      {error && (
        <p className="inline-error room-error" role="alert">
          {error}
        </p>
      )}
    </main>
  );
}
