"use client";

import { track } from "@vercel/analytics";
import { analyticsRuntimeAvailable, TEAMTOOLS_ANALYTICS_PREFERENCE_KEY } from "./privacy";

export type TeamToolsAnalyticsEvent =
  | "Room Created"
  | "Room Restored"
  | "Room Connected"
  | "Room Displayed"
  | "Vote Cast"
  | "Room Saved";

function browserPrivacySignal(): boolean {
  if (typeof window === "undefined") return true;
  return navigator.globalPrivacyControl === true
    || navigator.doNotTrack === "1"
    || window.doNotTrack === "1";
}

export function teamToolsAnalyticsAllowed(): boolean {
  if (typeof window === "undefined") return false;
  if (!analyticsRuntimeAvailable(window.location.hostname) || browserPrivacySignal()) return false;
  try {
    return localStorage.getItem(TEAMTOOLS_ANALYTICS_PREFERENCE_KEY) !== "off";
  } catch {
    return false;
  }
}

export function trackTeamToolsEvent(
  name: TeamToolsAnalyticsEvent,
  data?: Record<string, string | number | boolean>,
): void {
  if (!teamToolsAnalyticsAllowed()) return;
  track(name, data);
}
