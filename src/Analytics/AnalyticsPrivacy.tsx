"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Analytics, type BeforeSendEvent } from "@vercel/analytics/react";
import {
  analyticsRuntimeAvailable,
  normaliseAnalyticsUrl,
  TEAMTOOLS_ANALYTICS_PREFERENCE_KEY,
  TEAMTOOLS_GOOGLE_ANALYTICS_CONSENT_KEY,
  TEAMTOOLS_ANALYTICS_NOTICE_DISMISSED_KEY,
  TEAMTOOLS_ANALYTICS_NOTICE_SESSION_KEY,
  shouldAutoOpenAnalyticsNotice,
  type AnalyticsPreference,
  type GoogleAnalyticsConsent,
} from "./privacy";
import {
  disableGoogleAnalytics,
  googleAnalyticsConfigured,
  trackGoogleAnalyticsPageView,
} from "./google";

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

function readGoogleConsent(): GoogleAnalyticsConsent {
  try {
    const value = localStorage.getItem(TEAMTOOLS_GOOGLE_ANALYTICS_CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return "denied";
  }
}

function persistentNoticeDismissed(): boolean {
  try {
    return localStorage.getItem(TEAMTOOLS_ANALYTICS_NOTICE_DISMISSED_KEY) === "1";
  } catch {
    return true;
  }
}

function sessionNoticeDismissed(): boolean {
  try {
    return sessionStorage.getItem(TEAMTOOLS_ANALYTICS_NOTICE_SESSION_KEY) === "1";
  } catch {
    return true;
  }
}

function rememberPersistentDismissal(): void {
  try {
    localStorage.setItem(TEAMTOOLS_ANALYTICS_NOTICE_DISMISSED_KEY, "1");
    sessionStorage.removeItem(TEAMTOOLS_ANALYTICS_NOTICE_SESSION_KEY);
  } catch {
    // Storage failure leaves the privacy-safe defaults in force.
  }
}

function rememberSessionDismissal(): void {
  try {
    localStorage.removeItem(TEAMTOOLS_ANALYTICS_NOTICE_DISMISSED_KEY);
    sessionStorage.setItem(TEAMTOOLS_ANALYTICS_NOTICE_SESSION_KEY, "1");
  } catch {
    // Storage failure simply means the choice cannot outlive this render.
  }
}

export function AnalyticsPrivacy() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [runtimeAvailable, setRuntimeAvailable] = useState(false);
  const [vercelEnabled, setVercelEnabled] = useState(false);
  const [googleConsent, setGoogleConsent] = useState<GoogleAnalyticsConsent>(null);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [privacySignal, setPrivacySignal] = useState(false);

  useEffect(() => {
    const signal = browserPrivacySignal();
    const vercelPreference = readPreference();
    const storedGoogleConsent = readGoogleConsent();
    const available = analyticsRuntimeAvailable(window.location.hostname);
    setRuntimeAvailable(available);
    setPrivacySignal(signal);
    setVercelEnabled(available && !signal && vercelPreference !== "off");
    setGoogleConsent(signal ? "denied" : storedGoogleConsent);
    setNoticeOpen(available && shouldAutoOpenAnalyticsNotice(
      persistentNoticeDismissed(),
      sessionNoticeDismissed(),
      signal ? "denied" : storedGoogleConsent,
    ));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !runtimeAvailable || privacySignal || googleConsent !== "granted") {
      disableGoogleAnalytics();
      return;
    }
    trackGoogleAnalyticsPageView(window.location.href);
  }, [googleConsent, pathname, privacySignal, ready, runtimeAvailable]);

  const setVercelPreference = (preference: "on" | "off") => {
    if (privacySignal && preference === "on") return;
    try {
      localStorage.setItem(TEAMTOOLS_ANALYTICS_PREFERENCE_KEY, preference);
    } catch {
      setVercelEnabled(false);
      return;
    }
    setVercelEnabled(preference === "on" && !privacySignal && runtimeAvailable);
  };

  const setGooglePreference = (consent: Exclude<GoogleAnalyticsConsent, null>) => {
    if (privacySignal && consent === "granted") return;
    try {
      localStorage.setItem(TEAMTOOLS_GOOGLE_ANALYTICS_CONSENT_KEY, consent);
    } catch {
      setGoogleConsent("denied");
      disableGoogleAnalytics();
      return;
    }
    setGoogleConsent(consent);
    if (consent === "denied") disableGoogleAnalytics();
    setNoticeOpen(false);
  };

  const closeWithDefaults = () => {
    if (readPreference() === null) {
      try {
        localStorage.setItem(TEAMTOOLS_ANALYTICS_PREFERENCE_KEY, "on");
      } catch {
        // Preserve the current in-memory default if storage is unavailable.
      }
    }
    if (readGoogleConsent() === null) setGooglePreference("denied");
    rememberPersistentDismissal();
    setNoticeOpen(false);
  };

  const acceptGoogleCookies = () => {
    setGooglePreference("granted");
    rememberPersistentDismissal();
  };

  const denyGoogleCookiesForSession = () => {
    setGooglePreference("denied");
    rememberSessionDismissal();
  };

  const beforeSend = (event: BeforeSendEvent) => {
    if (!vercelEnabled) return null;
    return { ...event, url: normaliseAnalyticsUrl(event.url) };
  };

  if (ready && !runtimeAvailable) return null;

  return (
    <>
      {ready && vercelEnabled && <Analytics beforeSend={beforeSend} />}
      <button className="analytics-settings-link" type="button" onClick={() => setNoticeOpen(true)}>
        Analytics &amp; privacy
      </button>
      {ready && noticeOpen && (
        <aside className="analytics-notice" role="dialog" aria-modal="false" aria-label="Analytics and privacy">
          <button
            className="analytics-notice-close"
            type="button"
            aria-label="Close analytics preferences and use the defaults"
            onClick={closeWithDefaults}
          >
            ×
          </button>
          <div>
            <strong>Analytics &amp; privacy</strong>
            <p>
              Vercel Web Analytics gives us aggregate product usage without analytics cookies. Google Analytics is optional:
              it uses analytics cookies and does not load at all unless you explicitly allow it.
            </p>
            <p>
              <strong>We never send</strong> room names, room codes, vote positions, voter IDs, host tokens, or saved room history.
              Room URLs are anonymised to <code>/room/:room</code>, query strings and fragments are removed, and Google advertising
              storage, signals and personalisation stay disabled.
            </p>
            {privacySignal && <p><strong>Your browser is sending a privacy signal, so both analytics providers are disabled.</strong></p>}
            {!googleAnalyticsConfigured() && <p><strong>Google Analytics is not configured for this deployment.</strong></p>}

            <p><strong>Vercel aggregate analytics:</strong> {vercelEnabled ? "On" : "Off"}</p>
            <div className="analytics-notice-actions">
              <button className="button button--secondary" type="button" disabled={privacySignal} onClick={() => setVercelPreference(vercelEnabled ? "off" : "on")}>
                {vercelEnabled ? "Turn Vercel analytics off" : "Turn Vercel analytics on"}
              </button>
            </div>

            <p><strong>Google Analytics cookies:</strong> {googleConsent === "granted" ? "Allowed" : "Not allowed"}</p>
          </div>
          <div className="analytics-notice-actions">
            <button
              className="button button--primary"
              type="button"
              disabled={privacySignal || !googleAnalyticsConfigured()}
              onClick={acceptGoogleCookies}
            >
              Allow analytics cookies
            </button>
            <button className="button button--secondary" type="button" onClick={denyGoogleCookiesForSession}>
              No analytics cookies
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
