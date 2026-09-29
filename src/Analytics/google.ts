"use client";

import {
  analyticsRuntimeAvailable,
  normaliseAnalyticsUrl,
  TEAMTOOLS_GOOGLE_ANALYTICS_CONSENT_KEY,
} from "./privacy";

const GOOGLE_ANALYTICS_SCRIPT_ID = "teamtools-google-analytics";
const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

const EVENT_NAMES: Record<string, string> = {
  "Room Created": "room_created",
  "Room Restored": "room_restored",
  "Room Connected": "room_connected",
  "Room Displayed": "room_displayed",
  "Vote Cast": "vote_cast",
  "Room Saved": "room_saved",
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __teamToolsGaConfigured?: boolean;
    __teamToolsGaHistoryProtected?: boolean;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

function browserAvailable(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function gtag(...args: unknown[]): void {
  if (!browserAvailable()) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function (...queued: unknown[]) {
    window.dataLayer?.push(queued);
  };
  window.gtag(...args);
}

function safeLocation(rawUrl = browserAvailable() ? window.location.href : "/"): string {
  return normaliseAnalyticsUrl(rawUrl);
}

function applySafeLocation(rawUrl?: string): void {
  gtag("set", {
    page_location: safeLocation(rawUrl),
    page_referrer: "",
  });
}

function protectHistoryBeforeGoogleLoads(): void {
  if (!browserAvailable() || window.__teamToolsGaHistoryProtected) return;
  window.__teamToolsGaHistoryProtected = true;

  const wrap = (method: "pushState" | "replaceState") => {
    const original = history[method].bind(history);
    history[method] = ((state: unknown, unused: string, url?: string | URL | null) => {
      if (url != null) applySafeLocation(new URL(String(url), window.location.href).toString());
      return original(state, unused, url);
    }) as History[typeof method];
  };

  wrap("pushState");
  wrap("replaceState");
  window.addEventListener("popstate", () => applySafeLocation(window.location.href));
}

function googleConsentGranted(): boolean {
  if (!browserAvailable() || !MEASUREMENT_ID) return false;
  try {
    return localStorage.getItem(TEAMTOOLS_GOOGLE_ANALYTICS_CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

export function googleAnalyticsConfigured(): boolean {
  return Boolean(MEASUREMENT_ID);
}

export function ensureGoogleAnalytics(rawUrl?: string): boolean {
  if (
    !browserAvailable()
    || !MEASUREMENT_ID
    || !analyticsRuntimeAvailable(window.location.hostname)
    || !googleConsentGranted()
  ) {
    return false;
  }

  window[`ga-disable-${MEASUREMENT_ID}`] = false;
  protectHistoryBeforeGoogleLoads();

  if (!window.__teamToolsGaConfigured) {
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    applySafeLocation(rawUrl);
    gtag("config", MEASUREMENT_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: safeLocation(rawUrl),
      page_referrer: "",
    });
    window.__teamToolsGaConfigured = true;
  } else {
    applySafeLocation(rawUrl);
  }

  if (!document.getElementById(GOOGLE_ANALYTICS_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = GOOGLE_ANALYTICS_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    document.head.appendChild(script);
  }

  return true;
}

export function trackGoogleAnalyticsPageView(rawUrl?: string): void {
  if (!ensureGoogleAnalytics(rawUrl)) return;
  gtag("event", "page_view", {
    page_title: document.title,
    page_location: safeLocation(rawUrl),
    page_referrer: "",
  });
}

export function trackGoogleAnalyticsEvent(
  name: string,
  data?: Record<string, string | number | boolean>,
): void {
  const eventName = EVENT_NAMES[name];
  if (!eventName || !ensureGoogleAnalytics(window.location.href)) return;
  gtag("event", eventName, {
    ...data,
    page_location: safeLocation(window.location.href),
    page_referrer: "",
  });
}

function expireGoogleCookies(): void {
  const cookieNames = document.cookie
    .split(";")
    .map((entry) => entry.trim().split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));

  const host = window.location.hostname;
  const labels = host.split(".").filter(Boolean);
  const registrable = labels.length >= 2 ? `.${labels.slice(-2).join(".")}` : "";
  const domains = ["", host, `.${host}`, registrable].filter((value, index, all) => all.indexOf(value) === index);

  for (const name of cookieNames) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

export function disableGoogleAnalytics(): void {
  if (!browserAvailable() || !MEASUREMENT_ID) return;
  window[`ga-disable-${MEASUREMENT_ID}`] = true;
  if (window.gtag) {
    gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
  document.getElementById(GOOGLE_ANALYTICS_SCRIPT_ID)?.remove();
  expireGoogleCookies();
}
