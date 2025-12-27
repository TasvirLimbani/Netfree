"use client";

import React, { useEffect, useState } from "react";
import "./AdblockDetector.css";

interface AdblockDetectorProps {
    onChange?: (blocked: boolean) => void;
    checkIntervalMs?: number;
}

export default function AdblockDetector({
    onChange,
    checkIntervalMs = 0,
}: AdblockDetectorProps) {
    const [blocked, setBlocked] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const handleContextMenu = (e: { preventDefault: () => any; }) => e.preventDefault();
    
        const handleKeyDown = (e: { key: string; preventDefault: () => void; ctrlKey: any; shiftKey: any; }) => {
          // Block F12
          if (e.key === "F12") {
            e.preventDefault();
          }
    
          // Block Ctrl + Shift + (I, J, C)
          if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) {
            e.preventDefault();
          }
    
          // Block Ctrl + U
          if (e.ctrlKey && e.key === "U") {
            e.preventDefault();
          }
        };
    
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);
    
        return () => {
          document.removeEventListener("contextmenu", handleContextMenu);
          document.removeEventListener("keydown", handleKeyDown);
        };
      }, []);
    
    
    // Load dismissed state safely (client only)
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("adblockDismissed") === "true";
            setDismissed(saved);
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return; // SSR safe

        let intervalId: NodeJS.Timeout | null = null;
        let mounted = true;

        const detect = async () => {
            const isBlocked = await isAdblockPresent();
            if (!mounted) return;
            setBlocked(isBlocked);
            onChange?.(isBlocked);
        };

        detect();

        if (checkIntervalMs > 0) {
            intervalId = setInterval(detect, checkIntervalMs);
        }

        return () => {
            mounted = false;
            if (intervalId) clearInterval(intervalId);
        };
    }, [onChange, checkIntervalMs]);

    // Disable scroll when adblock popup is shown
    useEffect(() => {
        if (blocked && !dismissed) {
            document.body.style.overflow = "hidden";   // stop scroll
            document.body.style.pointerEvents = "none"; // disable clicks
        } else {
            document.body.style.overflow = "";
            document.body.style.pointerEvents = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.body.style.pointerEvents = "";
        };
    }, [blocked, dismissed]);


    if (!blocked || dismissed) return null;


    return (
        <div className="adblock-overlay" role="dialog" aria-modal="true" style={{ pointerEvents: "auto" }}>
            <div className="adblock-card">
                <center>

                    <h2 className="text-primary font-bold">Please disable your ad blocker</h2>
                    <p>
                        We detected an ad blocker. Please whitelist this site or disable the
                        blocker to continue.
                    </p>

                    <ol className="text-gray-600">
                        <li>Open your ad-blocker extension</li>
                        <li>Click "Whitelist site" / "Allow ads"</li>
                        <li>Reload the page</li>
                    </ol>

                    {/* <div className="adblock-actions"> */}
                    <button
                        className="adblock-btn primary"
                        onClick={() => window.location.reload()}
                    >
                        I disabled it — Reload
                    </button>
                    {/* </div> */}
                </center>
            </div>
        </div >
    );
}

/* ------------------------------------------
   Adblock detection logic (TypeScript version)
--------------------------------------------- */

export async function isAdblockPresent(timeout = 1500): Promise<boolean> {
    if (typeof window === "undefined") return false;

    // 1) Create bait element
    const bait = document.createElement("div");
    bait.className =
        "pub_300x250 ad_banner adsbox adsbygoogle ad-placement";

    bait.style.width = "1px";
    bait.style.height = "1px";
    bait.style.position = "absolute";
    bait.style.left = "-9999px";

    document.body.appendChild(bait);

    // 2) Try loading ad script
    const script = document.createElement("script");
    script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    script.async = true;

    const scriptLoad = new Promise<{ blocked: boolean }>((resolve) => {
        let done = false;

        const finish = (blocked: boolean) => {
            if (done) return;
            done = true;
            resolve({ blocked });
        };

        script.onload = () => finish(false);
        script.onerror = () => finish(true);

        setTimeout(() => finish(true), timeout);
    });

    document.body.appendChild(script);

    const { blocked: scriptBlocked } = await scriptLoad;

    const computed = window.getComputedStyle(bait);
    const baitHidden =
        bait.offsetHeight === 0
    bait.offsetWidth === 0
    computed.display === "none"
    computed.visibility === "hidden";

    if (bait.parentNode) bait.parentNode.removeChild(bait);
    if (script.parentNode) script.parentNode.removeChild(script);

    return scriptBlocked || baitHidden;
}