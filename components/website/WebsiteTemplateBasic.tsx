// components/website/WebsiteTemplateBasic.tsx
"use client";

import type React from "react";
import { WebsiteData } from "@/lib/websiteTypes";
import type { Theme } from "./theme";
import { resolveTheme } from "./theme";

import { Navbar } from "./sections/Navbar";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { OffersSection } from "./sections/OffersSection";
import { ContactSection } from "./sections/ContactSection";
import { Footer } from "./sections/Footer";

type Props = {
  data: WebsiteData;
  theme?: Theme;
};

export function WebsiteTemplateBasic({ data, theme }: Props) {
  console.log("from template data: ", data);
  const { style, primary, primaryHover, secondary } = resolveTheme(theme);
  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-50"
      style={style as React.CSSProperties}
    >
      <Navbar brandName={data.brandName} offersTitle={data.offers.title} />

      <HeroSection
        brandName={data.brandName}
        tagline={data.tagline}
        hero={data.hero}
        primary={primary}
        primaryHover={primaryHover}
      />

      <AboutSection about={data.about} />

      <FeaturesSection features={data.features} primary={primary} />

      <OffersSection
        offers={data.offers}
        primary={primary}
        primaryHover={primaryHover}
      />

      <ContactSection
        contact={data.contact}
        finalCta={data.finalCta}
        primary={primary}
        primaryHover={primaryHover}
      />

      <Footer brandName={data.brandName} />
    </div>
  );
}
