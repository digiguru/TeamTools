"use client";

import React, { FormEvent, useState } from "react";
import { track } from "@vercel/analytics";
import { api, type ModelType, type RoomSummary } from "./realtime";
import { MODEL_COPY } from "./modelCopy";

export function LandingPage() {
  const [model, setModel] = useState<ModelType>("comfort");
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

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
      track("Room Created", { model: result.room.model });
      window.location.href = `/room/${result.room.id}`;
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Could not create the room.",
      );
      setCreating(false);
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
            <span>
              Room name <small>optional</small>
            </span>
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
        {error && (
          <p className="inline-error" role="alert">
            {error}
          </p>
        )}
      </form>

      <section className="how-it-works">
        <div>
          <span>02</span>
          <strong>Share</strong>
          <p>
            The room slug is safe to put in chat or on screen. The host credential
            stays only in your browser.
          </p>
        </div>
        <div>
          <span>03</span>
          <strong>Vote privately</strong>
          <p>
            Everyone sees joined and voted counts, but nobody sees the distribution
            yet.
          </p>
        </div>
        <div>
          <span>04</span>
          <strong>Reveal together</strong>
          <p>
            The host freezes the round and reveals every anonymous point at once.
          </p>
        </div>
      </section>
    </main>
  );
}
