import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  analyticsRuntimeAvailable,
  normaliseAnalyticsUrl,
  shouldAutoOpenAnalyticsNotice,
  TEAMTOOLS_ANALYTICS_NOTICE_DISMISSED_KEY,
  TEAMTOOLS_ANALYTICS_NOTICE_SESSION_KEY,
  TEAMTOOLS_GOOGLE_ANALYTICS_CONSENT_KEY,
} from "../privacy";

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


it("Google Analytics consent uses a separate browser key", () => {
  expect(TEAMTOOLS_GOOGLE_ANALYTICS_CONSENT_KEY).toBe("teamtools-google-analytics-consent-v1");
});

it("uses persistent close and session-only denial semantics for the analytics notice", () => {
  expect(TEAMTOOLS_ANALYTICS_NOTICE_DISMISSED_KEY).toBe("teamtools-analytics-notice-dismissed-v1");
  expect(TEAMTOOLS_ANALYTICS_NOTICE_SESSION_KEY).toBe("teamtools-analytics-notice-session-v1");
  expect(shouldAutoOpenAnalyticsNotice(false, false, null)).toBe(true);
  expect(shouldAutoOpenAnalyticsNotice(false, false, "denied")).toBe(true);
  expect(shouldAutoOpenAnalyticsNotice(false, true, "denied")).toBe(false);
  expect(shouldAutoOpenAnalyticsNotice(true, false, "denied")).toBe(false);
  expect(shouldAutoOpenAnalyticsNotice(false, false, "granted")).toBe(false);
});


it("uses the canonical gtag queue and explicit destinations", () => {
  const source = readFileSync(new URL("../google.ts", import.meta.url), "utf8");
  expect(source).toContain("window.dataLayer?.push(arguments)");
  expect(source).not.toContain("window.dataLayer?.push(queued)");
  expect(source).toContain('gtag("js", new Date())');
  expect(source).toMatch(/gtag\("event", "page_view", \{[\s\S]*?send_to:\s*MEASUREMENT_ID/);
  expect(source).toMatch(/gtag\("event", eventName, \{[\s\S]*?send_to:\s*MEASUREMENT_ID/);
});
