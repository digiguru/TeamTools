"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import {
  api,
  readSavedRooms,
  replaceSavedRoomId,
  upsertSavedRoom,
  type ModelType,
  type RoomSummary,
  type SavedRoom,
} from "./realtime";
import { MODEL_COPY } from "./modelCopy";

export function LandingPage() {
  const [model, setModel] = useState<ModelType>("comfort");
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [liveRooms, setLiveRooms] = useState<RoomSummary[]>([]);
  const [savedRooms, setSavedRooms] = useState<SavedRoom[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setSavedRooms(readSavedRooms());
    api<{ rooms: RoomSummary[] }>("/api/live")
      .then((result) => setLiveRooms(result.rooms))
      .catch(() => setLiveRooms([]));
  }, []);

  const createRoom = async (event: FormEvent) => {
    event.preventDefault();
    setCreating(true);
    setError("");
    try {
      const result = await api<{ room: RoomSummary }>("/api/live", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim() || `${MODEL_COPY[model].title} check-in`,
          model,
        }),
      });
      upsertSavedRoom({
        id: result.room.id,
        name: result.room.name,
        model: result.room.model,
        createdAt: result.room.createdAt,
        updatedAt: result.room.updatedAt,
        votes: [],
      });
      track("Room Created", { model: result.room.model });
      window.location.href = `/room/${result.room.id}`;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not create the room.");
      setCreating(false);
    }
  };

  const restoreRoom = async (saved: SavedRoom) => {
    setRestoringId(saved.id);
    setError("");
    try {
      const result = await api<{
        room: RoomSummary;
        restored: boolean;
        replacedRoomId?: string;
      }>("/api/live", {
        method: "POST",
        body: JSON.stringify({ action: "restore", snapshot: saved }),
      });
      replaceSavedRoomId(saved.id, result.room);
      track("Room Restored", {
        model: result.room.model,
        recreated: result.restored,
      });
      window.location.href = `/room/${result.room.id}`;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not restore the room.");
      setRestoringId(null);
    }
  };

  return (
    <main className="landing">
      <header className="landing-hero">
        <span className="eyebrow">Anonymous team sense-making</span>
        <h1>Make the room visible.</h1>
        <p>
          Choose a model, share one link, let people place themselves privately,
          then reveal the shape of the room together.
        </p>
      </header>

      {(liveRooms.length > 0 || savedRooms.length > 0) && (
        <section className="host-room-dashboard">
          <div className="dashboard-heading">
            <div>
              <span className="step-number">HOST</span>
              <h2>Your rooms</h2>
            </div>
            <p>
              Saved rooms live in this browser, so you can reopen them even after
              the live server has restarted.
            </p>
          </div>

          {liveRooms.length > 0 && (
            <div className="saved-room-group">
              <h3>Live on this server</h3>
              <div className="saved-room-grid">
                {liveRooms.map((room) => (
                  <a className="saved-room-card" href={`/room/${room.id}`} key={room.id}>
                    <span className="saved-room-model">{MODEL_COPY[room.model].title}</span>
                    <strong>{room.name}</strong>
                    <small>{room.status === "revealed" ? "Revealed" : "Open"} · {room.id}</small>
                  </a>
                ))}
              </div>
            </div>
          )}

          {savedRooms.length > 0 && (
            <div className="saved-room-group">
              <h3>Saved in this browser</h3>
              <div className="saved-room-grid">
                {savedRooms.map((saved) => (
                  <article className="saved-room-card" key={saved.id}>
                    <span className="saved-room-model">{MODEL_COPY[saved.model].title}</span>
                    <strong>{saved.name}</strong>
                    <small>
                      {saved.votes.length} saved vote{saved.votes.length === 1 ? "" : "s"} · {saved.id}
                    </small>
                    <button
                      className="button button--secondary"
                      disabled={restoringId === saved.id}
                      onClick={() => restoreRoom(saved)}
                    >
                      {restoringId === saved.id ? "Opening…" : "Open saved room"}
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <form className="host-setup" onSubmit={createRoom}>
        <div className="setup-heading">
          <div>
            <span className="step-number">01</span>
            <h2>Choose the model</h2>
          </div>
          <p>
            Attendees are never asked for a name. Their browser gets one anonymous
            identity for this room.
          </p>
        </div>

        <div className="model-choice-grid">
          {(Object.keys(MODEL_COPY) as ModelType[]).map((key) => {
            const selected = model === key;
            return (
              <button
                type="button"
                key={key}
                className={`model-choice ${selected ? "model-choice--selected" : ""}`}
                aria-pressed={selected}
                onClick={() => setModel(key)}
              >
                <span className="model-choice__check">{selected ? "✓" : ""}</span>
                <strong>{MODEL_COPY[key].title}</strong>
                <span>{MODEL_COPY[key].short}</span>
                <small>{MODEL_COPY[key].detail}</small>
              </button>
            );
          })}
        </div>

        <div className="create-room-row">
          <label>
            <span>Room name <small>optional</small></span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              placeholder="e.g. Luna delivery team — Tuesday retro"
            />
          </label>
          <button className="button button--primary button--large" disabled={creating}>
            {creating ? "Creating…" : "Create host room"}
          </button>
        </div>
        {error && <p className="inline-error" role="alert">{error}</p>}
      </form>

      <section className="how-it-works">
        <div>
          <span>02</span>
          <strong>Share</strong>
          <p>The room slug is safe to put in chat or on screen. The host credential stays only in your browser.</p>
        </div>
        <div>
          <span>03</span>
          <strong>Vote privately</strong>
          <p>Everyone sees joined and voted counts, but nobody sees the distribution yet.</p>
        </div>
        <div>
          <span>04</span>
          <strong>Reveal together</strong>
          <p>The host freezes the round and reveals every anonymous point at once.</p>
        </div>
      </section>
    </main>
  );
}
