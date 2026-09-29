import { describe, expect, it } from "vitest";
import { analyticsRuntimeAvailable, normaliseAnalyticsUrl } from "../privacy";

describe("analytics privacy", () => {
  it("redacts room identifiers and removes query/hash data", () => {
    expect(normaliseAnalyticsUrl("https://teamtools.example/room/quiet-river-1234?token=secret#vote"))
      .toBe("https://teamtools.example/room/:room");
    expect(normaliseAnalyticsUrl("https://teamtools.example/?source=private#section"))
      .toBe("https://teamtools.example/");
  });

  it("keeps Vercel analytics out of local development", () => {
    expect(analyticsRuntimeAvailable("localhost")).toBe(false);
    expect(analyticsRuntimeAvailable("127.0.0.1")).toBe(false);
    expect(analyticsRuntimeAvailable("::1")).toBe(false);
    expect(analyticsRuntimeAvailable("teamtools.digiguru.co.uk")).toBe(true);
  });
});
