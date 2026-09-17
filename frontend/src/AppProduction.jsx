import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
const E_PAPER_URL = import.meta.env.VITE_E_PAPER_URL || "/epaper";
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";

// Notification registration is intentionally strict: the UI only reports success
// after a real PushSubscription has been stored by the API.
async function subscribeToPush(registration) {
  if (!VAPID_PUBLIC_KEY) throw new Error("VAPID_NOT_CONFIGURED");
  if (!API_BASE) throw new Error("API_NOT_CONFIGURED");
  if (!("PushManager" in window)) throw new Error("PUSH_NOT_SUPPORTED");

  const pad = "=".repeat((4 - VAPID_PUBLIC_KEY.length % 4) % 4);
  let bytes;
  try {
    const raw = atob((VAPID_PUBLIC_KEY + pad).replace(/-/g, "+").replace(/_/g, "/"));
    bytes = Uint8Array.from(raw, c => c.charCodeAt(0));
  } catch {
    throw new Error("VAPID_INVALID");
  }

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: bytes
    });
  }

  const response = await fetch(`${API_BASE}/api/notifications/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(subscription)
  });
  if (!response.ok) throw new Error(`SUBSCRIBE_${response.status}`);
  return subscription;
}

// Existing application code continues below unchanged.

