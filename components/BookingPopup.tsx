"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { site } from "@/lib/content";

/**
 * Home-page booking popup. Opens two ways: the hero Reserve button dispatches
 * `tt:open-booking`, and the popup opens itself a few seconds after the page
 * settles so a ready-to-book visitor does not have to hunt for it. Consistent
 * with the contact form: `/api/booking` forwards the enquiry to the Google
 * Apps Script, which emails the team and logs the row to the Bookings sheet;
 * the browser lands on `/thank-you`.
 */
export const OPEN_BOOKING_EVENT = "tt:open-booking";

/** Delay before the popup opens itself. Long enough for the intro to clear
 *  and for a visitor to settle into the hero first. */
const AUTO_OPEN_MS = 4500;

const ROOM_OPTIONS = ["Premium Room with Balcony", "Attic Room"] as const;

const MEAL_PLANS = [
  { id: "CP", label: "CP", detail: "Breakfast included" },
  { id: "MAP", label: "MAP", detail: "Breakfast + dinner" },
  { id: "EP", label: "EP", detail: "Room only, no meals" },
] as const;

type MealPlan = (typeof MEAL_PLANS)[number]["id"];

export default function BookingPopup() {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  // Only a deliberate click on "Reserve" should pull focus into the name
  // field — auto-opening must not pop the mobile keyboard.
  const focusOnOpen = useRef(false);
  // Guards the backdrop against a stray tap that started before the popup
  // appeared (common on phones: tap-and-scroll, popup opens, the tail of that
  // gesture lands on the overlay and closes it immediately).
  const openedAt = useRef(0);
  const autoOpened = useRef(false);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [room, setRoom] = useState<(typeof ROOM_OPTIONS)[number]>(ROOM_OPTIONS[0]);
  const [mealPlan, setMealPlan] = useState<MealPlan>("CP");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [notes, setNotes] = useState("");
  const [company, setCompany] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for the Reserve button, and open on its own shortly after landing
  // on the home page. The timer only runs on mount, so closing the popup does
  // not make it pop back up during the same visit.
  useEffect(() => {
    const mountedAt = Date.now();

    const onOpen = () => {
      focusOnOpen.current = true;
      setOpen(true);
    };
    window.addEventListener(OPEN_BOOKING_EVENT, onOpen);

    // Mobile browsers suspend timers in background tabs, and some in-app
    // browsers (Instagram, Facebook) delay them until the page is visible.
    // This fallback makes sure the popup still arrives on the first view.
    const autoOpen = () => {
      if (autoOpened.current) return;
      autoOpened.current = true;
      setOpen(true);
    };
    const timer = window.setTimeout(autoOpen, AUTO_OPEN_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible" && Date.now() - mountedAt < 10_000) {
        autoOpen();
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.removeEventListener(OPEN_BOOKING_EVENT, onOpen);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    openedAt.current = Date.now();
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    if (focusOnOpen.current) nameRef.current?.focus({ preventScroll: true });
    focusOnOpen.current = false;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const guests = `${adults} adult${adults === 1 ? "" : "s"}${
    children ? ` · ${children} ${children === 1 ? "child" : "children"}` : ""
  }`;

  const waMessage = useMemo(() => {
    const lines = [
      "Hello Twin Towers by Defoy, I would like to book a stay.",
      "",
      `Room: ${room}`,
      `Meal plan: ${mealPlan}`,
      name ? `Name: ${name}` : null,
      phone ? `Phone: ${phone}` : null,
      checkin ? `Check-in: ${checkin}` : null,
      checkout ? `Check-out: ${checkout}` : null,
      `Guests: ${guests}`,
      notes ? `Notes: ${notes}` : null,
      "",
      "Please confirm availability and next steps.",
    ].filter(Boolean);
    return lines.join("\n");
  }, [room, mealPlan, name, phone, checkin, checkout, guests, notes]);

  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(waMessage)}`;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    setError(null);

    if (name.trim().length < 2) {
      setError("Please add your name.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 8) {
      setError("Please add a phone number we can reach you on.");
      return;
    }
    if (checkin && checkout && checkout < checkin) {
      setError("Check-out cannot be before check-in.");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          roomCategory: room,
          mealPlan,
          checkin,
          checkout,
          adults,
          children,
          guests,
          notes,
          company,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "We could not send the request.");
      }

      try {
        sessionStorage.setItem(
          "tt-booking",
          JSON.stringify({ room, roomSlug: "", checkin, checkout, guests, mealPlan }),
        );
      } catch {
        // Same as the contact form: storage-blocked visitors get a generic thank-you page.
      }

      router.push(`/thank-you#room=${encodeURIComponent(room)}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not send the request. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book your stay"
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4 sm:p-6"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-walnut/80"
        aria-label="Close booking popup"
        onClick={() => {
          // Ignore a tap that was already in progress when the popup opened.
          if (Date.now() - openedAt.current > 350) setOpen(false);
        }}
      />

      <div className="relative max-h-[calc(100svh-2rem)] w-full max-w-[26rem] overflow-y-auto rounded-md border border-walnut/40 bg-paper shadow-[0_30px_80px_rgba(20,24,21,0.5)] sm:max-h-[90svh] sm:max-w-[44rem]">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-line text-ink/65 transition-colors hover:border-ink hover:text-ink"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 2 12 12M12 2 2 12" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>

        <div className="px-4 pb-5 pt-4 sm:px-6 sm:py-6">
          <p className="eyebrow text-ink/65">Book direct</p>
          <h2 className="mt-1 font-display text-[clamp(1.2rem,2.2vw,1.5rem)] leading-[1.05] tracking-[-0.03em]">
            Book your stay.
          </h2>

          <form className="mt-3 grid gap-2" onSubmit={submit} noValidate>
            <fieldset className="grid gap-1">
              <legend className="eyebrow mb-0.5 text-ink/65">
                01 — Room <span className="text-clay">*</span>
              </legend>

              {/* Phones get one dropdown where desktop gets the cards. */}
              <div className="relative sm:hidden">
                <select
                  id="popup-room"
                  aria-label="Room category"
                  value={room}
                  onChange={(event) =>
                    setRoom(event.target.value as (typeof ROOM_OPTIONS)[number])
                  }
                  className="w-full appearance-none border border-line bg-paper px-3 py-2.5 pr-9 font-display text-[0.95rem] text-ink outline-none focus:border-clay"
                >
                  {ROOM_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>

              <div className="hidden gap-1.5 sm:grid sm:grid-cols-2">
                {ROOM_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-2.5 border px-3.5 py-2.5 transition-colors duration-200 ${
                      room === option
                        ? "border-ink bg-forest text-paper"
                        : "border-line hover:border-ink/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="room-category"
                      value={option}
                      checked={room === option}
                      onChange={() => setRoom(option)}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                        room === option ? "border-paper" : "border-ink/30"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full transition-transform ${
                          room === option ? "scale-100 bg-copper" : "scale-0"
                        }`}
                      />
                    </span>
                    <span className="font-display text-[0.95rem] leading-tight">{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="grid gap-1">
              <legend className="eyebrow mb-0.5 text-ink/65">
                02 — Meal plan <span className="text-clay">*</span>
              </legend>

              <div className="relative sm:hidden">
                <select
                  id="popup-meal-plan"
                  aria-label="Meal plan"
                  value={mealPlan}
                  onChange={(event) => setMealPlan(event.target.value as MealPlan)}
                  className="w-full appearance-none border border-line bg-paper px-3 py-2.5 pr-9 font-display text-[0.95rem] text-ink outline-none focus:border-clay"
                >
                  {MEAL_PLANS.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.id} — {plan.detail}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>

              <div className="hidden gap-1.5 sm:grid sm:grid-cols-3">
                {MEAL_PLANS.map((plan) => (
                  <label
                    key={plan.id}
                    className={`flex cursor-pointer flex-col gap-0.5 border px-3.5 py-2 transition-colors duration-200 ${
                      mealPlan === plan.id
                        ? "border-ink bg-forest text-paper"
                        : "border-line hover:border-ink/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="meal-plan"
                      value={plan.id}
                      checked={mealPlan === plan.id}
                      onChange={() => setMealPlan(plan.id)}
                      className="sr-only"
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em]">
                      {plan.id}
                    </span>
                    <span
                      className={`text-[0.85rem] leading-snug ${
                        mealPlan === plan.id ? "text-paper/70" : "text-ink/65"
                      }`}
                    >
                      {plan.detail}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-3">
              <Field
                label={
                  <>
                    03 — Your name <span className="text-clay">*</span>
                  </>
                }
                htmlFor="popup-name"
              >
                <input
                  ref={nameRef}
                  id="popup-name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  autoComplete="name"
                  required
                  className="w-full bg-transparent py-2 text-[0.95rem] outline-none placeholder:text-ink/65"
                />
              </Field>
              <Field
                label={
                  <>
                    04 — Phone <span className="text-clay">*</span>
                  </>
                }
                htmlFor="popup-phone"
              >
                <input
                  id="popup-phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 …"
                  autoComplete="tel"
                  required
                  className="w-full bg-transparent py-2 text-[0.95rem] outline-none placeholder:text-ink/65"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="05 — Check-in" htmlFor="popup-checkin">
                <input
                  id="popup-checkin"
                  name="checkin"
                  type="date"
                  value={checkin}
                  onChange={(e) => setCheckin(e.target.value)}
                  className="w-full bg-transparent py-2 text-[0.95rem] outline-none"
                />
              </Field>
              <Field label="06 — Check-out" htmlFor="popup-checkout">
                <input
                  id="popup-checkout"
                  name="checkout"
                  type="date"
                  value={checkout}
                  onChange={(e) => setCheckout(e.target.value)}
                  className="w-full bg-transparent py-2 text-[0.95rem] outline-none"
                />
              </Field>
            </div>

            {/* Guests are desktop-only — on a phone the card stays short and
                the request defaults to two adults, which the team confirms. */}
            <fieldset className="hidden gap-1 [@media(min-width:640px)_and_(min-height:641px)]:grid">
              <legend className="eyebrow mb-0.5 text-ink/65">07 — Guests</legend>

              <div className="grid gap-2 sm:grid-cols-2">
                <Stepper label="Adults" value={adults} min={1} max={10} onChange={setAdults} />
                <Stepper label="Children" value={children} min={0} max={10} onChange={setChildren} />
              </div>
            </fieldset>

            <Field
              label={
                <>
                  <span className="sm:hidden">07</span>
                  <span className="hidden sm:inline">08</span>
                  {" — Anything we should know"}
                </>
              }
              htmlFor="popup-notes"
            >
              <textarea
                id="popup-notes"
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={1}
                placeholder="Anniversary, pickup, children's ages…"
                className="w-full resize-none bg-transparent py-2 text-[0.95rem] outline-none placeholder:text-ink/65"
              />
            </Field>

            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="popup-company">Company</label>
              <input
                id="popup-company"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            {error ? (
              <p
                role="alert"
                className="border border-clay/40 bg-clay/5 px-4 py-3 text-[0.9rem] leading-relaxed text-ink"
              >
                {error}{" "}
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line text-walnut"
                >
                  Send it on WhatsApp instead →
                </a>
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-3 border-t border-line pt-3 sm:gap-4 sm:pt-4">
              <button
                type="submit"
                className="btn disabled:opacity-60"
                disabled={sending}
              >
                {sending ? "Sending…" : "Send booking request"}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  className="arrow-static"
                >
                  <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line font-mono text-[10px] uppercase tracking-[0.2em]"
              >
                Or send on WhatsApp
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Chevron for the mobile dropdowns. */
function Chevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/60"
    >
      <path d="M2 4.5 6 8.5l4-4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border border-line px-3 py-2">
      <span className="eyebrow text-ink/65">{label}</span>
      <span className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Decrease"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-7 w-7 items-center justify-center border border-line text-ink transition-colors disabled:opacity-30 enabled:hover:border-ink"
        >
          −
        </button>
        <span className="min-w-[2ch] text-center font-mono text-[1.05rem] tabular-nums">
          {value}
        </span>
        <button
          type="button"
          aria-label="Increase"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-7 w-7 items-center justify-center border border-line text-ink transition-colors disabled:opacity-30 enabled:hover:border-ink"
        >
          +
        </button>
      </span>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: React.ReactNode;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`group border-b border-line pb-1 focus-within:border-clay ${className ?? ""}`}>
      <label htmlFor={htmlFor} className="eyebrow block text-ink/65">
        {label}
      </label>
      {children}
    </div>
  );
}
