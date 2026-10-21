import type { Metadata, Viewport } from "next";
import "@fontsource/barlow-condensed/500.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource-variable/montserrat/wght.css";
import "./globals.css";
import { site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Universe } from "@/components/universe/Universe";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — To See the Infinite · Edition 01 / Infinite Raga`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — To See the Infinite`,
    description: site.description,
    siteName: site.name,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#05070d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // Enables reveal styles only when JS runs, so content is never hidden without it.
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Universe />
        <SmoothScroll />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
