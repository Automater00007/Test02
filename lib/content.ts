export const site = {
  name: "Twin Towers by Defoy",
  group: "Defoy Hotels & Resorts",
  tagline: "Stay closer to what matters. A quieter kind of escape in Kashmir.",
  description:
    "A 25-room hotel on the road to Pahalgam, in Dehwathu, Kashmir. 22 Premium Rooms with Balcony and 3 Attic Rooms, warm timber, and the valley outside.",
  phone: "+91 95418 98817",
  phoneHref: "tel:+919541898817",
  whatsapp: "919541898817",
  email: "twintowers@defoy.in",
  address: "W7CF+W2P, Dehwathu, Pahalgam, Jammu and Kashmir 192401",
  coords: "33.92305759663491, 75.27313041534288",
  lat: 33.92305759663491,
  lng: 75.27313041534288,
  coordsDisplay: "33.9231° N · 75.2731° E",
  latDisplay: "33.9231° N",
  lngDisplay: "75.2731° E",
  elevation: "2,200 m",
  roomsTotal: 25,
  url: "https://defoyhotelsandresorts.com/twin-towers",
};

export const nav = [
  { label: "The hotel", href: "/hotel" },
  { label: "Stay", href: "/stay" },
  { label: "Dining", href: "/dining" },
  { label: "Gallery", href: "/gallery" },
  { label: "Location", href: "/location" },
  { label: "FAQ", href: "/faq" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

import { photo } from "@/lib/photos";

const twin = (name: string) => photo(name);

export const img = {
  hero: twin("exterior"),
  cabin: twin("facade"),
  valley: twin("lawn"),
  forest: twin("lawn"),
  aerial: twin("poster-1"),
  mist: twin("lawn-night"),
  green: twin("lobby"),
  dark: twin("corridor"),
  tree: twin("lawn"),
  pines: twin("lawn"),
  dock: twin("balcony"),
  stars: twin("lounge"),
  roomWarm: twin("suite-king-1"),
  roomBed: twin("suite-king-2"),
  roomSuite: twin("suite-attic-1"),
  roomLight: twin("suite-king-5"),
};

export type Room = {
  slug: string;
  name: string;
  short: string;
  count: string;
  price: number;
  description: string;
  long: string;
  image: string;
  gallery: string[];
  amenities: string[];
  bestFor: string;
};

export const rooms: Room[] = [
  {
    slug: "premium-balcony-room",
    name: "Premium Room with Balcony",
    short: "Premium",
    count: "22 rooms",
    price: 5000,
    description:
      "A calm, warm room with a king bed, a private balcony and enough space to unpack properly. Breakfast included, extra bed available on request.",
    long:
      "22 rooms are Premium Rooms with Balcony — a king bed, space for an extra bed, and a private view of the lawn or the valley. The 3 attic rooms sit on the fourth floor, closest to the roof, where the light arrives early and leaves late.",
    image: twin("suite-king-1"),
    gallery: [
      twin("suite-king-1"),
      twin("suite-king-2"),
      twin("suite-king-3"),
      twin("balcony"),
      twin("room-detail"),
      twin("bathroom"),
    ],
    amenities: [
      "King bed",
      "Private balcony",
      "Breakfast included",
      "Extra bed on request",
      "Wi-Fi",
      "Room service",
    ],
    bestFor: "Couples, families and slow mornings",
  },
  {
    slug: "attic-room",
    name: "Attic Room",
    short: "Attic",
    count: "3 attic rooms",
    price: 5000,
    description:
      "Fourth floor, closest to the roof. Warm timber, private balcony, and the mountain outside.",
    long:
      "The attic rooms sit on the fourth floor, closest to the roof, where the light arrives early and leaves late. King bed, warm panelling, private balcony, and a view that holds the valley.",
    image: twin("suite-attic-1"),
    gallery: [
      twin("suite-attic-1"),
      twin("suite-attic-2"),
      twin("suite-attic-3"),
      twin("balcony-breakfast"),
      twin("bathroom-2"),
    ],
    amenities: [
      "King bed",
      "Private balcony",
      "Warm timber panelling",
      "Breakfast included",
      "Wi-Fi",
      "Room service",
    ],
    bestFor: "Couples seeking quiet and views",
  },
];

export const gallery = [
  { src: twin("exterior"), alt: "The two towers across the lawn", span: "wide" },
  { src: twin("facade"), alt: "Red brick and white render against the mountains", span: "std" },
  { src: twin("entrance"), alt: "The glass entrance and lounge", span: "std" },
  { src: twin("lawn"), alt: "The garden walk at dusk", span: "wide" },
  { src: twin("lounge"), alt: "The lounge, timber and deep sofas", span: "std" },
  { src: twin("corridor"), alt: "The corridor on the room floors", span: "std" },
  { src: twin("balcony"), alt: "A private balcony facing the valley", span: "wide" },
  { src: twin("reception"), alt: "The reception lounge", span: "std" },
  { src: twin("approach"), alt: "The approach and parking court", span: "wide" },
  { src: twin("poster-1"), alt: "Twin Towers by Defoy from the lawn", span: "wide" },
  { src: twin("poster-2"), alt: "The house under fresh snow", span: "std" },
  { src: twin("lawn-night"), alt: "A fire on the lawn after dark", span: "std" },
  { src: twin("restaurant"), alt: "The restaurant, with the valley in the window", span: "wide" },
  { src: twin("suite-king-2"), alt: "A Premium Room in daylight", span: "std" },
  { src: twin("suite-attic-1"), alt: "An attic room under the roof", span: "std" },
  { src: twin("balcony-breakfast"), alt: "Breakfast on the balcony", span: "wide" },
];

export const posts = [
  {
    slug: "a-quiet-road-to-pahalgam",
    title: "A quiet road to Pahalgam",
    excerpt:
      "Past the stone drive and the last bend of Dehwathu, the valley opens. A short note on arriving.",
    date: "12 October 2025",
    read: "4 min",
    category: "Notes from the valley",
    image: twin("exterior"),
    heroImage: twin("approach"),
    quote: "The first hour of the day belongs to the mountains. Everything else arrives later.",
    body: [
      "There is a moment, a little before six, when the valley is still holding its breath. The pines are black against a sky that has not decided on a colour yet, and the mountains are the loudest thing in Pahalgam.",
      "Guests who arrive from Delhi or Mumbai tend to wake early on the first morning, still running on the speed of their week. They stand on the balcony with a cup of tea and listen. By the third morning, they are sleeping in.",
      "We do not schedule anything at this hour. There is hot water for tea, a chair facing the valley, and a road that follows the pines for as long as you want to walk it.",
      "If you come, set an alarm for one morning. Just one. Stand outside before the valley gets busy with itself. The mountains will already be there, doing exactly what they have always done.",
    ],
  },
  {
    slug: "a-slow-guide-to-aru-valley",
    title: "A slow guide to Aru Valley",
    excerpt:
      "Thirty-five minutes by road, then meadows, horses, and a silence that takes a while to notice.",
    date: "28 September 2025",
    read: "6 min",
    category: "Field guide",
    image: twin("lawn"),
    heroImage: twin("facade"),
    quote: "Aru is not a checklist. It is a meadow, a road, and the decision to stop walking.",
    body: [
      "Aru Valley is a short drive from the hotel, up a road that keeps folding back on itself. The climb is gentle enough to keep the window open. Pine gives way to open meadow, and then the valley widens.",
      "Most visitors arrive with a list: see the meadow, take the photograph, find the horse, leave. It is possible to do Aru that way. It is also possible to sit on the grass for an hour and watch the light move across the far slope, which is what we would suggest.",
      "Go early if you want the quiet, or late if you want the light. Bring a layer — the valley is cooler than Pahalgam, and the weather changes its mind quickly. Leave the itinerary in the car.",
    ],
  },
  {
    slug: "why-twenty-five-rooms-is-the-point",
    title: "Why twenty-five rooms is the point",
    excerpt:
      "A small property is not a limitation. It is the whole idea. On scale, attention, and knowing a guest's name.",
    date: "9 September 2025",
    read: "5 min",
    category: "Philosophy",
    image: twin("facade"),
    heroImage: twin("lounge"),
    quote: "Twenty-five is not a number we settled on. It is the number the property could hold without becoming something else.",
    body: [
      "A larger hotel can be many things to many people. It can have three restaurants, a spa, a business centre, a lobby that smells the same in every city. There is nothing wrong with that. It is simply not what this property was built to do.",
      "Twenty-five rooms means that on a full night, there are at most a few dozen people on the property. It means the kitchen knows how you take your eggs. It means the person at reception remembers which room asked for an extra blanket.",
      "Small has its own kind of luxury. It is not the luxury of marble or chandeliers. It is the luxury of being recognised, of not repeating yourself, of a place that can adjust to the guest rather than asking the guest to adjust to the system.",
      "Guests sometimes ask whether we plan to expand. The honest answer is that expansion would change the thing they are asking about. Twenty-five rooms is the whole idea.",
    ],
  },
];

export const reviews: {
  name: string;
  from: string;
  rating: number;
  title?: string;
  body: string;
  date: string;
}[] = [];

export const faqs = [
  {
    q: "Where is Twin Towers by Defoy located?",
    a: "Twin Towers by Defoy is in Dehwathu, on the road to Pahalgam, Jammu and Kashmir, India. Address: W7CF+W2P, Dehwathu, Pahalgam, Jammu and Kashmir 192401. Coordinates: 33.92305759663491, 75.27313041534288.",
  },
  {
    q: "How many rooms does Twin Towers by Defoy have?",
    a: "25 rooms in total — 22 Premium Rooms with Balcony and 3 Attic Rooms on the fourth floor, closest to the roof. Every room has a king bed and a private balcony.",
  },
  {
    q: "What are the room rates?",
    a: "Rooms start at INR 5,000 per night for a Premium Room with Balcony. Rates are confirmed at the time of booking.",
  },
  {
    q: "How do I book a stay?",
    a: "Bookings are by WhatsApp enquiry. Message +91 95418 98817 or use the reservation form on the website. The team confirms availability and the current rate.",
  },
  {
    q: "What are the check-in and check-out times?",
    a: "Check-in is at 2:00 PM and check-out is at 12:00 noon.",
  },
  {
    q: "How far is Srinagar Airport?",
    a: "Srinagar Airport is approximately 95 km from the hotel, about 2.5 to 3 hours by road.",
  },
];

export const policies = [
  {
    title: "Check-in & check-out",
    items: [
      "Check-in from 2:00 PM.",
      "Check-out by 12:00 noon.",
      "Early check-in and late check-out are subject to availability.",
    ],
  },
  {
    title: "Payment",
    items: [
      "Rates are confirmed at the time of booking.",
      "Advance payment is required to confirm a reservation.",
      "The balance is payable at the property.",
    ],
  },
  {
    title: "Identification",
    items: [
      "A valid government photo ID is required at check-in.",
      "Foreign nationals must present a passport and visa.",
    ],
  },
];
