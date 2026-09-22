import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ModelVisual } from "../ModelVisual";
import { roomIdFromLocation } from "../realtime";

describe("live room experience", () => {
  it("reads friendly room slugs from the URL", () => {
    history.pushState({}, "", "/room/steady-nexus-4821");
    expect(roomIdFromLocation()).toBe("steady-nexus-4821");

    history.pushState({}, "", "/");
    expect(roomIdFromLocation()).toBeNull();
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
