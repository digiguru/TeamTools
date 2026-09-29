export const TEAMTOOLS_ANALYTICS_PREFERENCE_KEY = "teamtools-analytics-preference-v1";

export type AnalyticsPreference = "on" | "off" | null;

export function normaliseAnalyticsUrl(rawUrl: string): string {
  const url = new URL(rawUrl, "https://teamtools.invalid");
  if (/^\/room\/[^/]+\/?$/.test(url.pathname)) {
    url.pathname = "/room/:room";
  }
  url.search = "";
  url.hash = "";
  return url.toString();
}

export function analyticsRuntimeAvailable(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return !["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(host);
}
