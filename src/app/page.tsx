import type { Metadata } from "next";

import { CapsSection } from "@/components/sections/CapsSection";
import { Hero } from "@/components/sections/Hero";
import { InstallSection } from "@/components/sections/InstallSection";
import { ScreenshotFigure } from "@/components/sections/ScreenshotFigure";
import { StatStrip } from "@/components/sections/StatStrip";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SkipLink } from "@/components/site/SkipLink";
import { fetchStarCount } from "@/content/stats";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * IA §3.1 / §10.1 — one scroll, five bands: hero, figures, the window capture,
 * the five capability rows and the install close. The star count is the only
 * data that comes from outside the build; `fetchStarCount` returns `null` rather
 * than guessing, and the strip drops the item (ENT-015).
 */
export default async function HomePage() {
  const stars = await fetchStarCount();

  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main" className="flex flex-col">
        <Hero />
        <StatStrip stars={stars} />
        <ScreenshotFigure />
        <CapsSection />
        <InstallSection />
      </main>
      <SiteFooter />
    </>
  );
}
