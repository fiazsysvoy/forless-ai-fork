"use client";

import { WebsiteData } from "@/lib/types/websiteTypes";

export type HeroSectionFormProps = {
  // type: WebsiteType;
  // onTypeChange: (t: WebsiteType) => void;
  data: WebsiteData;
  setData: React.Dispatch<React.SetStateAction<WebsiteData>>;
};

export function HeroSectionForm({
  // type,
  // onTypeChange,
  data,
  setData,
}: HeroSectionFormProps) {
  return (
    <div className="space-y-2">
      {/* Website type selector */}
      {/* <div>
        <p className="mb-2 text-xs text-slate-400">Website type</p>
        <div className="flex gap-2">
          {(
            ["product", "service", "personal", "business"] as WebsiteType[]
          ).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onTypeChange(t)}
              className={`rounded-full px-3 py-1 text-xs ${
                type === t
                  ? "bg-primary text-slate-950"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div> */}

      {/* Brand name */}
      <label className="block text-xs text-slate-400">
        Brand name
        <input
          value={data.brandName}
          onChange={(e) =>
            setData((d) => ({ ...d, brandName: e.target.value }))
          }
          className="input-base "
        />
      </label>

      {/* Tagline */}
      <label className="block text-xs text-slate-400">
        Tagline
        <input
          value={data.tagline ?? ""}
          onChange={(e) => setData((d) => ({ ...d, tagline: e.target.value }))}
          className="input-base"
        />
      </label>

      {/* Hero headline */}
      <label className="block text-xs text-slate-400">
        Hero headline
        <input
          value={data.hero.headline}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, headline: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      {/* Sub headline */}
      <label className="block text-xs text-slate-400">
        Sub Headline
        <input
          value={data.hero.subheadline}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, subheadline: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      {/* Hero image keyword */}
      <label className="block text-xs text-slate-400">
        Hero image keyword (Unsplash)
        <input
          value={data.hero.imageQuery}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, imageQuery: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      {/* Primary CTA */}
      <label className="block text-xs text-slate-400">
        Primary CTA
        <input
          value={data.hero.primaryCta}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, primaryCta: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      {/* Primary CTA Link */}
      <label className="block text-xs text-slate-400">
        Primary CTA Link
        <input
          value={data.hero.primaryCtaLink}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, primaryCtaLink: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      {/* Secondary CTA */}
      <label className="block text-xs text-slate-400">
        Secondary CTA
        <input
          value={data.hero.secondaryCta ?? ""}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, secondaryCta: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      {/* Secondary CTA Link */}
      <label className="block text-xs text-slate-400">
        Secondary CTA Link
        <input
          value={data.hero.secondaryCtaLink ?? ""}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, secondaryCtaLink: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>
    </div>
  );
}
