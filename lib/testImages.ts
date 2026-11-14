/**
 * TEMP: internet images hosted on Unsplash — used while the client is
 * testing remote image loading. The local `/images/twin/*.webp` originals
 * remain the source of truth; `twinImg()` simply maps every property-library
 * slug to a remote URL. To go back to local images, replace the helpers with
 * the `/images/twin/*.webp` paths.
 */
const UNSPLASH: Record<string, string> = {
  exterior: "photo-1566073771259-6a8506099945",
  facade: "photo-1445019980597-93fa8acb246c",
  entrance: "photo-1560448204-e02f11c3d0e2",
  lawn: "photo-1470252649378-9c29740c9fa8",
  lounge: "photo-1611892440504-42a792e24d32",
  corridor: "photo-1584132967334-10e028bd69f7",
  balcony: "photo-1631049307264-da0ec9d70304",
  restaurant: "photo-1521017432531-fbd92d768814",
  reception: "photo-1584622650111-993a426fbf0a",
  approach: "photo-1615655406736-b37c4fabf923",
  elevator: "photo-1584132967334-10e028bd69f7",
  "poster-1": "photo-1566073771259-6a8506099945",
  "poster-2": "photo-1445019980597-93fa8acb246c",
  "poster-3": "photo-1551882547-ff40c63fe5fa",
  "poster-4": "photo-1611892440504-42a792e24d32",
  "suite-king-1": "photo-1590490360182-c33d57733427",
  "suite-king-2": "photo-1631049307264-da0ec9d70304",
  "suite-king-3": "photo-1571896349842-33c89424de2d",
  "suite-king-4": "photo-1584622650111-993a426fbf0a",
  "suite-attic-1": "photo-1571896349842-33c89424de2d",
  "suite-attic-2": "photo-1615655406736-b37c4fabf923",
  "suite-attic-3": "photo-1584132967334-10e028bd69f7",
};

export const twinImg = (slug: string) =>
  UNSPLASH[slug]
    ? `https://images.unsplash.com/${UNSPLASH[slug]}?auto=format&fit=crop&w=1600&q=80`
    : "";
