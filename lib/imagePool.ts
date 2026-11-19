import { photo } from "@/lib/photos";

export type PoolImage = { src: string; alt: string };

/**
 * Every photograph in the property library. Sections pull from this pool with a
 * deterministic seed so the site feels varied but never changes between the
 * server render and the client hydration.
 */
export const imagePool: PoolImage[] = [
  { src: photo("exterior"), alt: "Twin Towers by Defoy from the lawn" },
  { src: photo("facade"), alt: "The house against the mountains" },
  { src: photo("entrance"), alt: "The glass entrance and lounge" },
  { src: photo("approach"), alt: "The approach and parking court" },
  { src: photo("lawn"), alt: "The garden walk at dusk" },
  { src: photo("lawn-night"), alt: "A fire on the lawn after dark" },
  { src: photo("lounge"), alt: "The lounge, timber and deep sofas" },
  { src: photo("lobby"), alt: "The lobby, looking toward reception" },
  { src: photo("reception"), alt: "The reception lounge" },
  { src: photo("corridor"), alt: "The corridor on the room floors" },
  { src: photo("balcony"), alt: "A private balcony facing the valley" },
  { src: photo("balcony-breakfast"), alt: "Breakfast on the balcony" },
  { src: photo("restaurant"), alt: "The restaurant, with the valley in the window" },
  { src: photo("restaurant-2"), alt: "Tables laid in the dining room" },
  { src: photo("bathroom"), alt: "A marble bathroom with a walk-in shower" },
  { src: photo("bathroom-2"), alt: "The stone bathroom in the attic rooms" },
  { src: photo("room-detail"), alt: "A king bed and a tray of fruit" },
  { src: photo("poster-1"), alt: "Twin Towers by Defoy from the lawn" },
  { src: photo("poster-2"), alt: "The house under fresh snow" },
  { src: photo("suite-king-1"), alt: "Premium Room with king bed" },
  { src: photo("suite-king-2"), alt: "Premium Room in warm daylight" },
  { src: photo("suite-king-3"), alt: "Premium Room, bed and reading chair" },
  { src: photo("suite-king-4"), alt: "Premium Room with a window seat" },
  { src: photo("suite-king-5"), alt: "Premium Room, tufted headboard" },
  { src: photo("suite-king-6"), alt: "Premium Room from the doorway" },
  { src: photo("suite-king-7"), alt: "Premium Room under warm downlights" },
  { src: photo("suite-attic-1"), alt: "Attic Room under the roof" },
  { src: photo("suite-attic-2"), alt: "Attic Room with a window to the valley" },
  { src: photo("suite-attic-3"), alt: "Attic Room, timber panelling" },
];
