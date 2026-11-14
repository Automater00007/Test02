import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import PreviewBridge from "@/components/PreviewBridge";
import SiteChrome from "@/components/SiteChrome";
import { site } from "@/lib/content";

/* Xogul type system: Manrope carries the experience, Inter carries the
   information. No serif, no mono, no decorative faces. */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://defoyhotelsandresorts.com"),
  title: {
    default: "Twin Towers by Defoy — A quieter kind of escape in Kashmir",
    template: "%s — Twin Towers by Defoy",
  },
  description: site.description,
  applicationName: "Twin Towers by Defoy",
  authors: [{ name: "Defoy Hotels & Resorts" }],
  keywords: [
    "Twin Towers by Defoy",
    "Pahalgam resort",
    "luxury resort Kashmir",
    "Pahalgam valley hotel",
    "boutique hotel Pahalgam",
    "Jammu and Kashmir stay",
    "Defoy Hotels",
  ],
  alternates: { canonical: "/twin-towers" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/twin-towers",
    siteName: "Twin Towers by Defoy",
    title: "Twin Towers by Defoy — A quieter kind of escape in Kashmir",
    description: site.description,
    images: [
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
        width: 1280,
        height: 720,
        alt: "Twin Towers by Defoy against the pines",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Twin Towers by Defoy — A quieter kind of escape in Kashmir",
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf8f3",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Twin Towers by Defoy",
  description: site.description,
  url: "https://defoyhotelsandresorts.com/twin-towers",
  telephone: "+919541898817",
  email: "info@defoy.in",
  priceRange: "₹5,000 – ₹5,000",
  numberOfRooms: 25,
  parentOrganization: { "@type": "Organization", name: "Defoy Hotels & Resorts" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "W7CF+W2P, Dehwathu",
    addressLocality: "Pahalgam",
    addressRegion: "Jammu & Kashmir",
    postalCode: "192401",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: site.lat, longitude: site.lng },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Private balconies", value: true },
    { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Room service", value: true },
    { "@type": "LocationFeatureSpecification", name: "Breakfast included", value: true },
    { "@type": "LocationFeatureSpecification", name: "Family-friendly", value: true },
    { "@type": "LocationFeatureSpecification", name: "Free parking", value: true },
  ],
  checkinTime: "14:00",
  checkoutTime: "12:00",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${inter.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="fixed left-4 top-4 z-[120] -translate-y-24 bg-crimson px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>

        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}[data-reveal] .reveal-media{clip-path:none!important;transform:none!important}`}</style>
        </noscript>

        <SiteChrome>{children}</SiteChrome>
        <PreviewBridge />
      </body>
    </html>
  );
}
