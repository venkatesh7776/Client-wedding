import type { Metadata, Viewport } from "next";
import { Amiri, Arbutus, Bricolage_Grotesque, Instrument_Serif } from "next/font/google";

import "./globals.css";
import "./meet.css";

const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const arbutus = Arbutus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-arbutus",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

/** Arabic face — Arbutus and Instrument Serif carry no Arabic glyphs. */
const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sahla Abdulla & Abdul Basith T.A",
  description: "November 2026 — Kozhikode, Kerala",
};

export const viewport: Viewport = {
  themeColor: "#0c2a3d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${arbutus.variable} ${bricolage.variable} ${amiri.variable}`}
    >
      <head>
        {/* The palace has to be decoded before the ring lands at 2.8s. */}
        <link rel="preload" as="image" href="/assets/images/loader-background.png" />
        <link rel="preload" as="image" href="/assets/images/hero-background.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
