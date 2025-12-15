// components/website/sections/OffersSection.tsx
import { withAlpha } from "../theme";

type OfferItem = {
  name: string;
  description: string;
  priceLabel?: string;
};

type OffersData = {
  title: string;
  items: OfferItem[];
};

type Props = {
  offers: OffersData;
  primary: string;
  primaryHover: string;
};

export function OffersSection({ offers, primary, primaryHover }: Props) {
  return (
    <section id="offers" className="border-t border-slate-800 bg-slate-900/40">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-xl font-semibold">{offers.title}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {offers.items.map((offer, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
              style={{ borderColor: withAlpha(primary, 0.22) }}
            >
              <div>
                <div className="text-sm font-semibold">{offer.name}</div>
                <p className="mt-2 text-xs text-slate-300">
                  {offer.description}
                </p>
              </div>
              {offer.priceLabel && (
                <div
                  className="mt-3 text-xs font-medium"
                  style={{ color: primaryHover }}
                >
                  {offer.priceLabel}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
