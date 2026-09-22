import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  arrangeComfortVotes,
  comfortZoneForVote,
  ModelVisual,
  projectTuckmanVote,
  tuckmanYForX,
} from "../ModelVisual";
import {
  readSavedRooms,
  roomIdFromLocation,
  saveRoomSnapshot,
} from "../realtime";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("live room experience", () => {
  it("shows a terminal missing-room state instead of reconnecting forever", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: "Room not found" }), {
          status: 404,
          headers: { "content-type": "application/json" },
        }),
      ),
    );

    const { RoomPage } = await import("../RoomPage");
    render(<RoomPage roomId="orphaned-room-1234" />);

    await waitFor(() =>
      expect(screen.getByText("This room is no longer live.")).toBeInTheDocument(),
    );
    expect(screen.getByRole("link", { name: "Go to Team Tools" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("reads friendly room slugs from the URL", () => {
    history.pushState({}, "", "/room/steady-nexus-4821");
    expect(roomIdFromLocation()).toBe("steady-nexus-4821");

    history.pushState({}, "", "/");
    expect(roomIdFromLocation()).toBeNull();
  });

  it("saves host room snapshots locally for restart recovery", () => {
    localStorage.clear();
    saveRoomSnapshot({
      type: "snapshot",
      room: {
        id: "steady-nexus-4821",
        name: "Recovered room",
        model: "comfort",
        status: "revealed",
        createdAt: 100,
        updatedAt: 200,
      },
      isHost: true,
      myVote: null,
      joinedCount: 2,
      votedCount: 2,
      votes: [
        { x: 0.4, y: 0.5 },
        { x: 0.7, y: 0.5 },
      ],
    });

    expect(readSavedRooms()).toEqual([
      expect.objectContaining({
        id: "steady-nexus-4821",
        name: "Recovered room",
        votes: [
          { x: 0.4, y: 0.5 },
          { x: 0.7, y: 0.5 },
        ],
      }),
    ]);
  });

  it("lets an attendee place a private point on the visual", () => {
    const onVote = vi.fn();
    const { container } = render(
      <ModelVisual
        model="comfort"
        vote={null}
        revealedVotes={[]}
        interactive
        onVote={onVote}
      />,
    );

    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();

    vi.spyOn(svg as SVGSVGElement, "getBoundingClientRect").mockReturnValue({
      x: 100,
      y: 50,
      left: 100,
      top: 50,
      right: 1100,
      bottom: 650,
      width: 1000,
      height: 600,
      toJSON: () => ({}),
    } as DOMRect);

    fireEvent.pointerUp(svg as SVGSVGElement, {
      clientX: 600,
      clientY: 350,
    });

    expect(onVote).toHaveBeenCalledWith({ x: 0.5, y: 0.5 });
  });

  it("projects Tuckman votes onto the model line", () => {
    const projected = projectTuckmanVote({ x: 0.625, y: 0.92 });
    expect(projected.x).toBeCloseTo(0.625);
    expect(projected.y).toBeGreaterThan(0.3);
    expect(projected.y).toBeLessThan(0.7);
    expect(tuckmanYForX(0.05)).toBeCloseTo(0.5);
    expect(tuckmanYForX(0.125)).toBeCloseTo(0.5);
    expect(tuckmanYForX(0.375)).toBeCloseTo(0.698);
    expect(tuckmanYForX(0.875)).toBeCloseTo(0.302);
    expect(tuckmanYForX(0.95)).toBeCloseTo(0.302);
  });

  it("arranges revealed comfort votes as an outward spiral", () => {
    const arranged = arrangeComfortVotes([
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.72 },
      { x: 0.9, y: 0.5 },
    ]);
    const radii = arranged.map((point) =>
      Math.hypot((point.x - 0.5) * 1000, (point.y - 0.5) * 600),
    );
    expect(radii[0]).toBeLessThan(radii[1]);
    expect(radii[1]).toBeLessThan(radii[2]);
    expect(comfortZoneForVote({ x: 0.5, y: 0.5 })).toBe("Comfort");
  });

  it("does not render percentage labels on the Tuckman chart", () => {
    render(
      <ModelVisual
        model="tuckman"
        vote={null}
        revealedVotes={[]}
        interactive={false}
      />,
    );
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it("highlights the attendee's own point after reveal", () => {
    render(
      <ModelVisual
        model="tuckman"
        vote={{ x: 0.75, y: 0.4 }}
        revealedVotes={[
          { x: 0.18, y: 0.72 },
          { x: 0.75, y: 0.4, mine: true },
        ]}
        interactive={false}
      />,
    );

    expect(screen.getByText("you")).toBeInTheDocument();
    expect(screen.getByText("Performing")).toBeInTheDocument();
  });
});
