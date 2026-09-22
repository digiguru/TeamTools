import { describe, expect, it } from "vitest";
import { countPresence, participantPresence } from "../Presence";

describe("live-session presence capability", () => {
  it("deduplicates connections by participant and classifies active, contributed and waiting states", () => {
    const now = 20_000;
    const presence = participantPresence(
      [
        { participantId: "p1", connected: true, lastActiveAt: 19_900 },
        { participantId: "p1", connected: true, lastActiveAt: 19_950 },
        { participantId: "p2", connected: true, lastActiveAt: 19_800 },
        { participantId: "p3", connected: true, lastActiveAt: 1_000 },
        { participantId: "p4", connected: false, lastActiveAt: 19_900 }
      ],
      [{ participantId: "p1", value: "done" }],
      now,
      1_000
    );

    expect(countPresence(presence)).toEqual({
      connected: 3,
      active: 2,
      contributed: 1,
      waiting: 1
    });
  });

  it("keeps a contributed participant active while connected even after interaction timeout", () => {
    const presence = participantPresence(
      [{ participantId: "p1", connected: true, lastActiveAt: 1_000 }],
      [{ participantId: "p1", value: "done" }],
      20_000,
      500
    );

    expect(presence[0]).toMatchObject({
      active: true,
      contributed: true,
      waiting: false
    });
  });

  it("expires idle non-contributors without sleeping", () => {
    const connection = [{ participantId: "p1", connected: true, lastActiveAt: 1_000 }];

    expect(countPresence(participantPresence(connection, [], 1_200, 300))).toEqual({
      connected: 1,
      active: 1,
      contributed: 0,
      waiting: 1
    });

    expect(countPresence(participantPresence(connection, [], 1_301, 300))).toEqual({
      connected: 1,
      active: 0,
      contributed: 0,
      waiting: 0
    });
  });
});
