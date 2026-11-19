"use client";

import { useEffect, useState } from "react";
import { site, type Room } from "@/lib/content";

type Booking = {
  room?: string;
  roomSlug?: string;
  checkin?: string;
  checkout?: string;
  guests?: string;
  mealPlan?: string;
};

/**
 * The thank-you page is server-rendered, but the room and dates live only in
 * the browser (URL fragment + sessionStorage), so the WhatsApp message is built
 * after mount. Before that the button opens a generic, still-useful message.
 */
export default function ThankYouActions({ rooms }: { rooms: Room[] }) {
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fromHash = window.location.hash.match(/room=([^&]+)/)?.[1];

    let stored: Booking | null = null;
    try {
      stored = JSON.parse(sessionStorage.getItem("tt-booking") || "null") as Booking | null;
    } catch {
      stored = null;
    }

    const slug = fromHash ? decodeURIComponent(fromHash) : stored?.roomSlug;
    const room =
      rooms.find((item) => item.slug === slug) ??
      (stored?.room ? rooms.find((item) => item.name === stored?.room) : undefined);

    setBooking({
      ...(stored ?? {}),
      room: room?.name ?? stored?.room,
      roomSlug: room?.slug ?? stored?.roomSlug,
    });
  }, [rooms]);

  const lines = [
    "Hello Twin Towers by Defoy, I have just sent a booking request.",
    booking?.room ? `Room: ${booking.room}` : null,
    booking?.mealPlan ? `Meal plan: ${booking.mealPlan}` : null,
    booking?.checkin ? `Check-in: ${booking.checkin}` : null,
    booking?.checkout ? `Check-out: ${booking.checkout}` : null,
    booking?.guests ? `Guests: ${booking.guests}` : null,
    "",
    "Could you confirm availability and the next steps?",
  ].filter(Boolean);

  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;

  return (
    <div className="mt-8 flex flex-wrap items-center gap-5">
      <a href={href} target="_blank" rel="noopener noreferrer" className="btn">
        Continue on WhatsApp
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="arrow-static">
          <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </a>
      <a href={site.phoneHref} className="link-line font-mono text-[10px] uppercase tracking-[0.2em]">
        Or call {site.phone}
      </a>
      <a
        href={`mailto:${site.email}`}
        className="link-line font-mono text-[10px] uppercase tracking-[0.2em]"
      >
        Email us
      </a>
    </div>
  );
}
