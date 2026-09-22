import React from "react";

export type SessionTransport = "local" | "realtime";

type SessionStatusProps = {
  transport: SessionTransport;
  label?: string;
};

export function SessionStatus({ transport, label }: SessionStatusProps) {
  const text = label ?? (transport === "realtime" ? "Live session" : "Local session");
  return (
    <div className="status-pill" data-session-transport={transport}>
      <span className="status-dot" />
      {text}
    </div>
  );
}
