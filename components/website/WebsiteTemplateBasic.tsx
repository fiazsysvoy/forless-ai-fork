// src/components/website/WebsiteTemplateBasic.tsx
"use client";
import { useEffect, useState } from "react";
import { WebsiteData } from "@/lib/websiteTypes";
import { fetchUnsplashImage } from "@/lib/unsplash";
import Image from "next/image";
import Link from "next/link";

type Props = { data: WebsiteData };

export function WebsiteTemplateBasic({ data }: Props) {
  const [heroImage, setHeroImage] = useState("");
  const [aboutImage, setAboutImage] = useState("");

  useEffect(() => {
    fetchUnsplashImage(data.hero.imageQuery).then(setHeroImage);
    fetchUnsplashImage(data.about.imageQuery).then(setAboutImage);
  }, [data.hero.imageQuery, data.about.imageQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Navbar */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="font-semibold">{data.brandName}</div>
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#about">About</a>
            <a href="#offers">{data.offers.title}</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary-hover">
            {data.tagline}
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            {data.hero.headline}
          </h1>
          <p className="mt-4 text-sm text-slate-300">{data.hero.subheadline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={data.hero.primaryCtaLink || "#"}
              className=" rounded-full cursor-pointer bg-primary px-5 py-2 text-sm font-medium text-slate-950"
            >
              {data.hero.primaryCta}
            </Link>

            <Link
              href={data.hero.secondaryCtaLink || "#"}
              className=" rounded-full border border-slate-600 px-5 py-2 text-sm font-medium"
            >
              {data.hero.secondaryCta}
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={data.brandName}
              width={500}
              height={800}
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-slate-800 animate-pulse" />
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-slate-800 bg-slate-900/40">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">{data.about.title}</h2>
            <p className="mt-4 text-sm text-slate-300">{data.about.body}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-800">
            {aboutImage ? (
              <Image
                src={aboutImage}
                alt={data.about.title}
                width={500}
                height={800}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-slate-800 animate-pulse" />
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-xl font-semibold">{data.features.title}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {data.features.items.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
              >
                <div className="text-sm font-medium">{item.label}</div>
                <p className="mt-2 text-xs text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers (products/services) */}
      <section
        id="offers"
        className="border-t border-slate-800 bg-slate-900/40"
      >
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-xl font-semibold">{data.offers.title}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {data.offers.items.map((offer, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div>
                  <div className="text-sm font-semibold">{offer.name}</div>
                  <p className="mt-2 text-xs text-slate-300">
                    {offer.description}
                  </p>
                </div>
                {offer.priceLabel && (
                  <div className="mt-3 text-xs font-medium text-primary-hover">
                    {offer.priceLabel}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact + Final CTA */}
      <section
        id="contact"
        className="border-t border-slate-800 bg-linear-to-b from-slate-900 to-slate-950"
      >
        <div className="mx-auto max-w-5xl px-4 py-12">
          {/* Heading + intro */}
          <div className="max-w-xl">
            <h2 className="text-xl font-semibold">{data.contact.title}</h2>
            <p className="mt-3 text-sm text-slate-300">
              {data.contact.description}
            </p>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {/* Contact details */}
            <div className="space-y-4 text-sm">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <h3 className="text-sm font-semibold text-slate-100">
                  Contact details
                </h3>
                <p className="mt-2 text-xs text-slate-400">
                  Prefer email, WhatsApp, or a quick call? Reach us using any of
                  the options below.
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Email</span>
                    <span className="text-xs font-medium text-slate-100">
                      {data.contact.email}
                    </span>
                  </div>

                  {data.contact.whatsapp && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">WhatsApp</span>
                      <span className="text-xs font-medium text-slate-100">
                        {data.contact.whatsapp}
                      </span>
                    </div>
                  )}

                  {data.contact.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Phone</span>
                      <span className="text-xs font-medium text-slate-100">
                        {data.contact.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional small reassurance / note */}
              <p className="text-xs text-slate-400">
                We usually reply within 24 hours on business days.
              </p>
            </div>

            {/* Contact form card */}
            <form
              className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/40"
              onSubmit={(e) => e.preventDefault()}
            >
              <h3 className="text-lg font-semibold text-slate-100">
                {data.finalCta.headline}
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                {data.finalCta.subheadline}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-slate-300">
                  Your name
                  <input
                    type="text"
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 outline-none ring-0 focus:border-primary"
                    placeholder="Enter your name"
                  />
                </label>

                <label className="text-xs text-slate-300">
                  Email
                  <input
                    type="email"
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 outline-none ring-0 focus:border-primary"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label className="mt-3 block text-xs text-slate-300">
                Message
                <textarea
                  rows={4}
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 outline-none ring-0 focus:border-primary"
                  placeholder="Tell us a bit about what you need help with..."
                />
              </label>

              <button
                type="submit"
                className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-medium text-slate-950"
              >
                {data.finalCta.buttonLabel}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 text-xs text-slate-500">
          <span>
            © {new Date().getFullYear()} {data.brandName}
          </span>
          <span>Made with ❤️ by ForlessAI</span>
        </div>
      </footer>
    </div>
  );
}
