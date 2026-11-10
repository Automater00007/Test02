import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, DM_Mono, Inter } from "next/font/google";
import "./globals.css";
import PreviewBridge from "@/components/PreviewBridge";
import SiteChrome from "@/components/SiteChrome";
import { site } from "@/lib/content";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  variable: "--font-dm-mono",
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
    "valley River hotel",
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
        url: "/images/twin/exterior.webp",
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

const introScript = `(function(){try{var seen=sessionStorage.getItem('jr-intro');var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!seen&&!reduce){document.documentElement.setAttribute('data-intro','1');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${manrope.variable} ${dmMono.variable} ${inter.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tt-theme')||'day';document.documentElement.dataset.theme=t;}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="fixed left-4 top-4 z-[120] -translate-y-24 bg-forest px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-paper transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>

        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}[data-reveal] .reveal-media{clip-path:none!important;transform:none!important}.intro-stage{display:none!important}`}</style>
        </noscript>

        <SiteChrome>{children}</SiteChrome>
        <PreviewBridge />
      </body>
    </html>
  );
}
