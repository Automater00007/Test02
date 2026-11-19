import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ThankYouActions from "@/components/ThankYouActions";
import { rooms, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Request received",
  description:
    "Your booking request has reached the Twin Towers by Defoy team. We reply from twintowers@defoy.in, usually within the hour on working days.",
  alternates: { canonical: "/thank-you" },
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <>
      <PageHeader
        eyebrow="Request · Received"
        title={
          <>
            Thank you.
            <br />
            The valley is <em className="text-clay">already waiting.</em>
          </>
        }
        intro="Your request has reached the hotel team. A person — not a portal — will reply with availability and the final rate, usually within the hour on working days."
        aside={
          <div className="flex items-end justify-between border-t border-line pt-5">
            <p className="font-mono text-[9px] uppercase leading-[1.9] tracking-[0.16em] text-ink/65">
              Reply from
              <br />
              {site.email}
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/65">
              Direct only
            </span>
          </div>
        }
      />

      <section className="shell pb-16 md:pb-24">
        <div className="grid gap-10 border-t border-line pt-8 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-7">
            <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.1]">
              Continue on WhatsApp while you wait.
            </h2>
            <p className="body-copy mt-5 max-w-[58ch]">
              Messages move faster than email in the valley. The button below
              opens a pre-filled WhatsApp note with the room you picked — send
              it and the team can confirm dates straight away. If you would
              rather talk, the direct line is answered by the people who run
              the property.
            </p>
            <ThankYouActions rooms={rooms} />
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <div className="space-y-6 border-t border-line pt-5">
              <div>
                <p className="eyebrow text-ink/65">What happens next</p>
                <ol className="mt-4 space-y-3 text-[0.92rem] leading-relaxed text-ink/70">
                  <li>1 · We check availability for your dates.</li>
                  <li>2 · You get the final rate and a 50% advance link.</li>
                  <li>3 · The advance confirms the stay.</li>
                </ol>
              </div>
              <div className="border-t border-line pt-5">
                <p className="eyebrow text-ink/65">While you are here</p>
                <div className="mt-4 flex flex-col gap-3">
                  <Link href="/stay" className="link-line text-[0.95rem]">
                    See the rooms →
                  </Link>
                  <Link href="/gallery" className="link-line text-[0.95rem]">
                    Walk through the gallery →
                  </Link>
                  <Link href="/blog" className="link-line text-[0.95rem]">
                    Read a note from the valley →
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
