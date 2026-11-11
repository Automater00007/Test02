/**
 * Hero — intentionally simple.
 *
 * The cinematic scroll-film is deferred. For now this is a single
 * auto-playing, looping, muted video that fills the viewport and stays
 * responsive at every breakpoint (100svh, object-cover, no fixed heights,
 * no scroll listeners, no canvas work).
 */
export default function HeroFilm() {
  return (
    <section id="journey" className="journey" aria-label="Twin Towers by Defoy">
      <div className="journey-sticky">
        <video
          src="/video/film-720.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        />
        <div className="journey-scrim" aria-hidden="true" />
      </div>
    </section>
  );
}
