"use client";

import { WebsiteData } from "@/lib/types/websiteTypes";

type OffersSectionFormProps = {
  data: WebsiteData;
  setData: React.Dispatch<React.SetStateAction<WebsiteData>>;
};

export function ProductsSectionForm({ data, setData }: OffersSectionFormProps) {
  const updateOffer = (
    index: number,
    field: "name" | "description" | "priceLabel",
    value: string
  ) => {
    setData((prev) => {
      const updated = [...prev.offers.items];
      updated[index] = { ...updated[index], [field]: value };

      return {
        ...prev,
        offers: { ...prev.offers, items: updated },
      };
    });
  };

  const addOffer = () => {
    setData((prev) => ({
      ...prev,
      offers: {
        ...prev.offers,
        items: [
          ...prev.offers.items,
          {
            name: "New offer",
            description: "Describe this offer...",
            priceLabel: "",
          },
        ],
      },
    }));
  };

  const removeOffer = (index: number) => {
    setData((prev) => ({
      ...prev,
      offers: {
        ...prev.offers,
        items: prev.offers.items.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-4">
      {/* Offers section title */}
      <label className="block text-xs text-slate-400">
        Offers Section Title
        <input
          value={data.offers.title}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              offers: { ...prev.offers, title: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      {/* Offers list */}
      <div className="space-y-4">
        {data.offers.items.map((offer, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-700 bg-slate-900/50 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-300">
                Offer {index + 1}
              </h4>

              {data.offers.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOffer(index)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>

            <label className="mt-2 block text-xs text-slate-400">
              Name
              <input
                value={offer.name}
                onChange={(e) => updateOffer(index, "name", e.target.value)}
                className="input-base"
              />
            </label>

            <label className="mt-2 block text-xs text-slate-400">
              Description
              <textarea
                value={offer.description}
                onChange={(e) =>
                  updateOffer(index, "description", e.target.value)
                }
                rows={2}
                className="input-base"
              />
            </label>

            <label className="mt-2 block text-xs text-slate-400">
              Price label (optional)
              <input
                value={offer.priceLabel ?? ""}
                onChange={(e) =>
                  updateOffer(index, "priceLabel", e.target.value)
                }
                placeholder="e.g. From $19/mo"
                className="input-base"
              />
            </label>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addOffer}
        className="w-full rounded-full bg-primary px-3 py-2 text-xs font-medium text-slate-950"
      >
        + Add Offer
      </button>
    </div>
  );
}
