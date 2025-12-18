// components/website/sections/HeroSection.tsx
import Link from "next/link";
import Image from "next/image";
import { withAlpha } from "../theme";
import { useUnsplashImage } from "../hooks/useUnsplashImage";

type HeroData = {
  headline: string;
  subheadline: string;
  primaryCta: string;
  primaryCtaLink?: string;
  secondaryCta?: string;
  secondaryCtaLink?: string;
  imageQuery: string;
};

type Props = {
  brandName: string;
  tagline: string;
  hero: HeroData;
  primary: string;
  primaryHover: string;
};

export function HeroSection({
  brandName,
  tagline,
  hero,
  primary,
  primaryHover,
}: Props) {
  const heroImage = useUnsplashImage(hero.imageQuery);
  // console.log("hero: ", hero);

  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2">
      <div>
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: primaryHover }}
        >
          {tagline}
        </p>

        <h1 className="mt-3 text-3xl font-bold md:text-4xl">{hero.headline}</h1>

        <p
          className="mt-4 text-sm text-slate-300"
          style={{ color: primaryHover }}
        >
          {hero.subheadline}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={hero.primaryCtaLink || "#"}
            className="rounded-full cursor-pointer px-5 py-2 text-sm font-medium text-slate-950 transition"
            style={{ backgroundColor: primary }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                String(primaryHover);
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                String(primary);
            }}
          >
            {hero.primaryCta}
          </Link>

          <Link
            href={hero.secondaryCtaLink || "#"}
            className="rounded-full border border-slate-600 px-5 py-2 text-sm font-medium transition"
            style={{
              backgroundColor: withAlpha(primary, 0.08),
              borderColor: withAlpha(primary, 0.35),
            }}
          >
            {hero.secondaryCta}
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={brandName}
            width={500}
            height={800}
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-slate-800 animate-pulse" />
        )}
      </div>
    </section>
  );
}
