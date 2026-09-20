import type { Metadata, Viewport } from "next";
import {
  Amiri,
  Arbutus,
  Bricolage_Grotesque,
  Playfair_Display,
  Instrument_Serif,
} from "next/font/google";

import "./globals.css";
import "./meet.css";
import "./celebrate.css";
import "./night.css";
import "./venues.css";
import "./countdown.css";
import "./dress.css";
import "./rsvp.css";
import "./message.css";
import "./contact.css";
import "./closing.css";
import "./lanterns.css";

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

/**
 * The couple's names, wherever they appear.
 *
 * Playfair Display regular: high-contrast and formal like DM Serif, but a good
 * deal lighter at these sizes. It is a variable font, so the weight can be
 * tuned here without loading another cut.
 */
const nameFace = Playfair_Display({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-names-face",
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
  themeColor: "#01313e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${arbutus.variable} ${bricolage.variable} ${amiri.variable} ${nameFace.variable}`}
    >
      <head>
        {/* The palace has to be decoded before the ring lands at 2.8s. */}
        <link rel="preload" as="image" href="/assets/images/new%20loader%20bg.webp" />
        <link rel="preload" as="image" href="/assets/images/hero-background.webp" />
        {/* Warm the track too: it has to be ready the instant the guest first
            touches the page, and by then the sections below are downloading. */}
        <link rel="preload" as="audio" href="/assets/audio/mp3.mp3" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
