import React, { useEffect, useState } from "react";
import "./AdblockDetector.css";

/**
 * AdblockDetector
 * - Detects adblock using two techniques:
 *   1) Add a "bait" DOM element with ad-like classnames and check visibility.
 *   2) Insert a script tag pointing at a known ad provider and watch for onerror.
 *
 * Props:
 *  - onChange(isBlocked) optional callback
 *  - checkIntervalMs optional number to re-check periodically (default 0 = no periodic check)
 */
export default function AdblockDetector({ onChange, checkIntervalMs = 0 }) {
  const [blocked, setBlocked] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem("adblockDismissed") === "true"
  );

  useEffect(() => {
    let intervalId = null;
    let mounted = true;

    async function detect() {
      const res = await isAdblockPresent();
      if (!mounted) return;
      setBlocked(res);
      if (typeof onChange === "function") onChange(res);
    }

    detect();

    if (checkIntervalMs > 0) {
      intervalId = setInterval(detect, checkIntervalMs);
    }

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [onChange, checkIntervalMs]);

  function handleClose() {
    setDismissed(true);
    localStorage.setItem("adblockDismissed", "true");
  }

  // if not blocked or dismissed -> render nothing
  if (!blocked || dismissed) return null;

  return (
    <div className="adblock-overlay" role="dialog" aria-modal="true">
      <div className="adblock-card">
        <h2>Please disable your ad blocker</h2>
        <p>
          We noticed you're using an ad blocker. To help us keep this site free
          and running, please whitelist our domain or disable your ad blocker
          for this site.
        </p>
        <ol>
          <li>Open your ad-blocker extension menu</li>
          <li>Choose "Don't run on this site" / "Whitelist domain" / "Allow ads"</li>
          <li>Reload the page</li>
        </ol>
        <div className="adblock-actions">
          <button className="adblock-btn primary" onClick={() => window.location.reload()}>
            I whitelisted — reload
          </button>
         
        </div>
        <button
          className="adblock-close"
          aria-label="Close"
          onClick={handleClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}

/* detection logic exported for unit testing / reuse */
export async function isAdblockPresent(timeout = 1500) {
  // Technique 1: bait element check
  const bait = document.createElement("div");
  bait.className = "pub_300x250 ad_banner adsbox adsbygoogle ad-placement";
  // inline styles to hide it from real users visually but still measurable
  bait.style.width = "1px";
  bait.style.height = "1px";
  bait.style.position = "absolute";
  bait.style.left = "-9999px";
  document.body.appendChild(bait);

  // technique 2: try to load a common ad script (will be blocked by many adblockers)
  const script = document.createElement("script");
  // A commonly blocked ad script URL — adblockers frequently block requests for this path.
  // Note: script may get blocked (onerror) or removed; we handle both.
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
  script.async = true;

  const scriptLoadPromise = new Promise((resolve) => {
    let done = false;
    const cleanup = () => {
      script.onload = null;
      script.onerror = null;
    };

    script.onload = () => {
      if (done) return;
      done = true;
      cleanup();
      resolve({ scriptBlocked: false });
    };
    script.onerror = () => {
      if (done) return;
      done = true;
      cleanup();
      resolve({ scriptBlocked: true });
    };

    // timeout fallback
    setTimeout(() => {
      if (done) return;
      done = true;
      cleanup();
      // If nothing fired within timeout, assume blocked/filtered
      resolve({ scriptBlocked: true });
    }, timeout);
  });

  // Append script to DOM
  document.body.appendChild(script);

  // Wait for script detection result
  const { scriptBlocked } = await scriptLoadPromise;

  // Evaluate bait element visibility
  const baitComputed = window.getComputedStyle
    ? window.getComputedStyle(bait)
    : null;
  const baitHidden =
    !bait.offsetParent || // removed from layout
    bait.offsetHeight === 0 ||
    bait.offsetWidth === 0 ||
    (baitComputed && (baitComputed.display === "none" || baitComputed.visibility === "hidden"));

  // cleanup
  document.body.removeChild(bait);
  // some ad blockers remove the script element, others leave it; attempt to remove
  if (script.parentNode) script.parentNode.removeChild(script);

  // If either method indicates blocking, we consider adblock present
  return scriptBlocked || baitHidden;
}
