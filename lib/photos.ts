/**
 * The property photo library.
 *
 * Every file lives in `public/Twin-Tower/` and is named after the moment it
 * shows. Sections reference photos by these slugs so a single path change
 * updates the whole site.
 */
const FILES = {
  exterior: "/Twin-Tower/exterior.webp",
  facade: "/Twin-Tower/facade.webp",
  entrance: "/Twin-Tower/entrance.webp",
  approach: "/Twin-Tower/approach.webp",
  lawn: "/Twin-Tower/lawn.webp",
  "lawn-night": "/Twin-Tower/poster-3.webp",
  lounge: "/Twin-Tower/lounge.webp",
  lobby: "/Twin-Tower/lobby.webp",
  reception: "/Twin-Tower/reception.webp",
  corridor: "/Twin-Tower/corridor.webp",
  elevator: "/Twin-Tower/corridor.webp",
  balcony: "/Twin-Tower/balcony.webp",
  "balcony-breakfast": "/Twin-Tower/poster-4.webp",
  restaurant: "/Twin-Tower/restaurant.webp",
  "restaurant-2": "/Twin-Tower/restaurant-2.webp",
  bathroom: "/Twin-Tower/bathroom.webp",
  "bathroom-2": "/Twin-Tower/bathroom-2.webp",
  "room-detail": "/Twin-Tower/room-detail.webp",
  "poster-1": "/Twin-Tower/poster-1.webp",
  "poster-2": "/Twin-Tower/poster-2.webp",
  "poster-3": "/Twin-Tower/poster-3.webp",
  "poster-4": "/Twin-Tower/poster-4.webp",
  "suite-king-1": "/Twin-Tower/suite-king-1.webp",
  "suite-king-2": "/Twin-Tower/suite-king-2.webp",
  "suite-king-3": "/Twin-Tower/suite-king-3.webp",
  "suite-king-4": "/Twin-Tower/suite-king-4.webp",
  "suite-king-5": "/Twin-Tower/suite-king-5.webp",
  "suite-king-6": "/Twin-Tower/suite-king-6.webp",
  "suite-king-7": "/Twin-Tower/suite-king-7.webp",
  "suite-attic-1": "/Twin-Tower/suite-attic-1.webp",
  "suite-attic-2": "/Twin-Tower/suite-attic-2.webp",
  "suite-attic-3": "/Twin-Tower/suite-attic-3.webp",
} as const;

export type PhotoName = keyof typeof FILES;

export const photo = (name: PhotoName | string): string =>
  (FILES as Record<string, string>)[name] ?? "";
