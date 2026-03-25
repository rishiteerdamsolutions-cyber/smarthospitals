import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Poppins } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Smart Hospitals - Complete Hospital Digital System",
    template: "%s | Smart Hospitals",
  },
  description:
    "Mobile-first hospital web app with lead capture, CRM, appointments, inventory, and India-compliant prescriptions.",
  openGraph: {
    title: "Smart Hospitals - Complete Hospital Digital System",
    description:
      "Generate patient leads, manage appointments, and digitize hospital operations.",
    url: siteConfig.url,
    siteName: "Smart Hospitals",
    type: "website",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Smart Hospitals",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${poppins.variable} h-full antialiased`}
      data-theme="theme1"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
