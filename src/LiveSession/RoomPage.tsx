import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { ModelVisual } from "./ModelVisual";
import {
  getHostToken,
  roomWebSocketUrl,
  type RoomSnapshot,
  type VotePoint,
} from "./realtime";
import { MODEL_COPY } from "./modelCopy";

function ShareButton({ roomId }: { roomId: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = `${location.origin}/room/${roomId}`;
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
  const [connection, setConnection] = useState<"connecting" | "live" | "offline">("connecting");
  const [error, setError] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<number | null>(null);
  const unmountedRef = useRef(false);
  const displayedRef = useRef(false);

  const connect = useCallback(() => {
    if (
      unmountedRef.current ||
      (socketRef.current && socketRef.current.readyState <= WebSocket.OPEN)
    ) {
      return;
    }

    setConnection("connecting");
    const socket = new WebSocket(roomWebSocketUrl(roomId));
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      track("Room Connected");
      setConnection("live");
      setError("");
      socket.send(
        JSON.stringify({
          type: "authenticate-host",
          hostToken: getHostToken(),
        }),
      );
    });

    socket.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "snapshot") {
          const nextSnapshot = message as RoomSnapshot;
          if (!displayedRef.current) {
            displayedRef.current = true;
            track("Room Displayed", {
              model: nextSnapshot.room.model,
              role: nextSnapshot.isHost ? "host" : "attendee",
              status: nextSnapshot.room.status,
            });
          }
          setSnapshot(nextSnapshot);
        }
        if (message.type === "error") {
          setError(message.error || "Something went wrong.");
        }
      } catch {
        setError("Received an invalid room update.");
      }
    });

    socket.addEventListener("close", () => {
      setConnection("offline");
      socketRef.current = null;
      if (!unmountedRef.current) {
        reconnectRef.current = window.setTimeout(connect, 900);
      }
    });

    socket.addEventListener("error", () => setConnection("offline"));
  }, [roomId]);

  useEffect(() => {
    unmountedRef.current = false;
    connect();

    return () => {
      unmountedRef.current = true;
      if (reconnectRef.current) {
        window.clearTimeout(reconnectRef.current);
      }
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [connect]);

  const send = (message: unknown) => {
    const socket = socketRef.current;
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  const castVote = (vote: VotePoint) => {
    if (!snapshot || snapshot.isHost || snapshot.room.status !== "open") {
      return;
    }
    const changed = Boolean(snapshot.myVote);
    setSnapshot({ ...snapshot, myVote: vote });
    send({ type: "vote", vote });
    track("Vote Cast", { model: snapshot.room.model, changed });
  };

  const reveal = () => send({ type: "reveal" });
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
        {snapshot?.isHost && <ShareButton roomId={roomId} />}
      </header>

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

      <section className="room-workspace">
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
