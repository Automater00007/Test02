import type { NextRequest } from "next/server";
import { rooms, site } from "@/lib/content";
import { formatPrice } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * Booking enquiries are forwarded to a Google Apps Script web app, which sends
 * the email and returns `{ "ok": true }`. The web-app URL stays on the server
 * (`GOOGLE_APPS_SCRIPT_BOOKING_URL`) so it can be swapped or revoked without a
 * redeploy, and the shared secret (`BOOKING_WEBHOOK_SECRET`) lets the script
 * reject anything that did not come from this site.
 *
 * Setup: see `scripts/google-apps-script/booking.gs` for the script and
 * `.env.example` for the two environment variables.
 */

type Submission = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  room?: unknown;
  roomCategory?: unknown;
  mealPlan?: unknown;
  adults?: unknown;
  children?: unknown;
  checkin?: unknown;
  checkout?: unknown;
  guests?: unknown;
  notes?: unknown;
  company?: unknown;
};

const ROOM_CATEGORIES = ["Premium Room with Balcony", "Attic Room"] as const;

const MEAL_PLANS = ["EP", "CP", "MAP"] as const;

const MAX_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_PER_WINDOW) return false;

  entry.count += 1;
  return true;
}

function text(value: unknown, max: number): string {
  // The popup steppers send guests/rooms as numbers, not strings.
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.trunc(value)).slice(0, max);
  }
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!rateLimit(ip)) {
    return Response.json(
      { ok: false, error: "Too many requests. Please try again in a few minutes." },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }

  let input: Submission;

  try {
    input = (await request.json()) as Submission;
  } catch {
    return Response.json(
      { ok: false, error: "Could not read that request." },
      { status: 400 },
    );
  }

  // Hidden field filled by bots. Pretend it worked so they do not retry.
  if (text(input.company, 200)) {
    return Response.json({ ok: true }, { status: 201 });
  }

  const name = text(input.name, 80);
  const email = text(input.email, 160);
  const phone = text(input.phone, 40);
  const roomSlug = text(input.room, 96);
  const roomCategory = text(input.roomCategory, 64);
  const mealPlan = text(input.mealPlan, 8).toUpperCase();
  const adults = Math.min(10, Math.max(1, Number.parseInt(text(input.adults, 3), 10) || 2));
  const children = Math.min(10, Math.max(0, Number.parseInt(text(input.children, 3), 10) || 0));
  const isPopup = roomCategory.length > 0;
  const checkin = text(input.checkin, 10);
  const checkout = text(input.checkout, 10);
  const notes = text(input.notes, 1500);

  // Popup: phone is mandatory; meal plan and room category restricted to known values.
  if (isPopup) {
    if (!ROOM_CATEGORIES.includes(roomCategory as (typeof ROOM_CATEGORIES)[number])) {
      return Response.json(
        { ok: false, error: "Please choose a valid room category." },
        { status: 422 },
      );
    }
    if (mealPlan && !MEAL_PLANS.includes(mealPlan as (typeof MEAL_PLANS)[number])) {
      return Response.json(
        { ok: false, error: "Please choose a valid meal plan." },
        { status: 422 },
      );
    }
    if (phone.replace(/\D/g, "").length < 8) {
      return Response.json(
        { ok: false, error: "Please add a phone number we can reach you on." },
        { status: 422 },
      );
    }
  }

  if (name.length < 2) {
    return Response.json(
      { ok: false, error: "Please add your name." },
      { status: 422 },
    );
  }

  if (!email && !phone) {
    return Response.json(
      {
        ok: false,
        error: "Please add an email address or a phone number so we can reply.",
      },
      { status: 422 },
    );
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return Response.json(
      { ok: false, error: "That email address does not look right." },
      { status: 422 },
    );
  }

  if ((checkin && !isDate(checkin)) || (checkout && !isDate(checkout))) {
    return Response.json(
      { ok: false, error: "Please pick valid dates." },
      { status: 422 },
    );
  }

  if (checkin && checkout && checkout < checkin) {
    return Response.json(
      { ok: false, error: "Check-out cannot be before check-in." },
      { status: 422 },
    );
  }

  // Room naming for the lead email: the contact form uses the room name +
  // price; the homepage popup passes a plain category label instead.
  let roomName: string;
  let roomSlugForPayload: string;
  let nightlyRate = "";
  let guests: string;

  if (isPopup) {
    roomName = roomCategory;
    roomSlugForPayload = "";
    nightlyRate = "";
    guests =
      children > 0
        ? `${adults} adults · ${children} ${children === 1 ? "child" : "children"}`
        : `${adults} adult${adults === 1 ? "" : "s"}`;
  } else {
    const room = rooms.find((item) => item.slug === roomSlug);
    if (!room) {
      return Response.json(
        { ok: false, error: "Please choose a room." },
        { status: 422 },
      );
    }
    roomName = room.name;
    roomSlugForPayload = room.slug;
    nightlyRate = formatPrice(room.price);
    guests = text(input.guests, 40) || "2";
  }

  const webhook = process.env.GOOGLE_APPS_SCRIPT_BOOKING_URL;
  if (!webhook) {
    console.error(
      "[booking] GOOGLE_APPS_SCRIPT_BOOKING_URL is not set. Follow scripts/google-apps-script/booking.gs and add the deployment URL to the environment.",
    );
    return Response.json(
      {
        ok: false,
        error:
          "Online booking is not connected yet. Please send the request on WhatsApp or call us — both buttons are right there.",
      },
      { status: 503 },
    );
  }

  const submittedAt = new Date().toISOString();

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
      body: JSON.stringify({
        secret: process.env.BOOKING_WEBHOOK_SECRET || "",
        name,
        email,
        phone,
        room: roomName,
        roomSlug: roomSlugForPayload,
        nightlyRate,
        mealPlan: mealPlan || undefined,
        adults: isPopup ? adults : undefined,
        children: isPopup ? children : undefined,
        form: isPopup ? "popup" : "contact",
        checkin,
        checkout,
        guests,
        notes,
        submittedAt,
        source: isPopup ? site.url + "/ (booking popup)" : site.url + "/contact",
      }),
    });

    const raw = await response.text().catch(() => "");
    let payload: { ok?: boolean; error?: string } | null = null;
    try {
      payload = raw ? (JSON.parse(raw) as { ok?: boolean; error?: string }) : null;
    } catch {
      // A login page or an HTML error wrapper is not a success: the script
      // must answer with `{"ok":true}`.
      payload = null;
    }

    if (!response.ok || payload?.ok !== true) {
      console.error("[booking] Apps Script did not acknowledge the request.", {
        status: response.status,
        body: raw.slice(0, 500),
      });
      return Response.json(
        {
          ok: false,
          error:
            payload?.error ||
            "We could not confirm the request just now. Please try again, or use WhatsApp.",
        },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    return Response.json(
      { ok: true },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[booking] Could not reach the Apps Script web app.", error);
    return Response.json(
      {
        ok: false,
        error:
          "We could not send the request just now. Please try again, or use WhatsApp.",
      },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
