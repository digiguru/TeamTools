"use client";

import { useEffect, useState } from "react";
import { Analytics, type BeforeSendEvent } from "@vercel/analytics/react";
import {
  analyticsRuntimeAvailable,
  normaliseAnalyticsUrl,
  TEAMTOOLS_ANALYTICS_PREFERENCE_KEY,
  type AnalyticsPreference,
} from "./privacy";

function browserPrivacySignal(): boolean {
  const privacyNavigator = navigator as Navigator & { globalPrivacyControl?: boolean };
  const privacyWindow = window as Window & { doNotTrack?: string };
  return privacyNavigator.globalPrivacyControl === true
    || navigator.doNotTrack === "1"
    || privacyWindow.doNotTrack === "1";
}

function readPreference(): AnalyticsPreference {
  try {
    const value = localStorage.getItem(TEAMTOOLS_ANALYTICS_PREFERENCE_KEY);
    return value === "on" || value === "off" ? value : null;
  } catch {
    return "off";
  }
}

export function AnalyticsPrivacy() {
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [privacySignal, setPrivacySignal] = useState(false);

  useEffect(() => {
    const signal = browserPrivacySignal();
    const preference = readPreference();
    const runtimeAvailable = analyticsRuntimeAvailable(window.location.hostname);
    setPrivacySignal(signal);
    setEnabled(runtimeAvailable && !signal && preference !== "off");
    setNoticeOpen(preference === null || signal);
    setReady(true);
  }, []);

  const setPreference = (preference: "on" | "off") => {
    if (privacySignal && preference === "on") return;
    try {
      localStorage.setItem(TEAMTOOLS_ANALYTICS_PREFERENCE_KEY, preference);
    } catch {
      setEnabled(false);
      setNoticeOpen(false);
      return;
    }
    setEnabled(preference === "on" && !privacySignal && analyticsRuntimeAvailable(window.location.hostname));
    setNoticeOpen(false);
  };

  const beforeSend = (event: BeforeSendEvent) => {
    if (!enabled) return null;
    return { ...event, url: normaliseAnalyticsUrl(event.url) };
  };

  return (
    <>
      {ready && enabled && <Analytics beforeSend={beforeSend} />}
      <button className="analytics-settings-link" type="button" onClick={() => setNoticeOpen(true)}>
        Analytics &amp; privacy
      </button>
      {ready && noticeOpen && (
        <aside className="analytics-notice" role="region" aria-label="Analytics and privacy">
          <div>
            <strong>Analytics &amp; privacy</strong>
            <p>
              Team Tools uses privacy-friendly Vercel Web Analytics to understand aggregate page and feature use so the service can be improved.
              We may record page views, broad browser/device information, coarse location, and anonymous product events such as creating a room or casting a vote.
            </p>
            <p>
              <strong>We never send</strong> room names, room codes, vote positions, voter IDs, host tokens, or saved room history to analytics.
              Room URLs are anonymised before reporting. There are no advertising trackers or analytics cookies.
            </p>
            {privacySignal && <p><strong>Your browser is sending a privacy signal, so analytics are disabled.</strong></p>}
          </div>
          <div className="analytics-notice-actions">
            <button
              className="button button--primary"
              type="button"
              disabled={privacySignal}
              onClick={() => setPreference("on")}
            >
              {privacySignal ? "Analytics disabled" : "Keep analytics on"}
            </button>
            <button className="button button--secondary" type="button" onClick={() => setPreference("off")}>
              Turn analytics off
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
