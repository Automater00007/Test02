const twin = (name: string) => `/images/twin/${name}.webp`;

export type PoolImage = { src: string; alt: string };

/**
 * Every photograph in the property library. Sections pull from this pool with a
 * deterministic seed so the site feels varied but never changes between the
 * server render and the client hydration.
 */
export const imagePool: PoolImage[] = [
  { src: twin("exterior"), alt: "Twin Towers by Defoy against the pines" },
  { src: twin("facade"), alt: "Five storeys framed in timber and brick" },
  { src: twin("entrance"), alt: "Entrance canopy and stone drive" },
  { src: twin("lawn"), alt: "The lawn with rope chairs and the valley" },
  { src: twin("lounge"), alt: "Lounge with warm lighting" },
  { src: twin("corridor"), alt: "Interior corridor with timber panelling" },
  { src: twin("balcony"), alt: "Private balcony facing the mountains" },
  { src: twin("restaurant"), alt: "The restaurant at Twin Towers by Defoy" },
  { src: twin("reception"), alt: "Reception desk in warm timber" },
  { src: twin("approach"), alt: "The approach to the property" },
  { src: twin("elevator"), alt: "Timber-lined elevator lobby" },
  { src: twin("poster-1"), alt: "Twin Towers by Defoy, hero view" },
  { src: twin("poster-2"), alt: "The house in the afternoon light" },
  { src: twin("poster-3"), alt: "Balconies above the lawn" },
  { src: twin("poster-4"), alt: "The valley beyond the roofline" },
  { src: twin("suite-king-1"), alt: "Premium Room with king bed" },
  { src: twin("suite-king-2"), alt: "Premium Room in warm daylight" },
  { src: twin("suite-king-3"), alt: "Premium Room detail" },
  { src: twin("suite-king-4"), alt: "Premium Room balcony light" },
  { src: twin("suite-attic-1"), alt: "Attic Room under the roof" },
  { src: twin("suite-attic-2"), alt: "Attic Room timber panelling" },
  { src: twin("suite-attic-3"), alt: "Attic Room window" },
];

/** Small, deterministic PRNG so seeded picks are stable across renders. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns `count` images, shuffled deterministically for the given seed.
 * Duplicates are avoided until the whole pool has been used.
 */
export function pickImages(seed: number, count: number): PoolImage[] {
  const rand = mulberry32(seed);
  const deck = [...imagePool];
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return Array.from({ length: count }, (_, i) => deck[i % deck.length]);
}
