"use client";

import { WebsiteData } from "@/lib/websiteTypes";

type FeaturesSectionFormProps = {
  data: WebsiteData;
  setData: React.Dispatch<React.SetStateAction<WebsiteData>>;
};

export function FeaturesSectionForm({
  data,
  setData,
}: FeaturesSectionFormProps) {
  const updateItem = (
    index: number,
    field: "label" | "description",
    value: string
  ) => {
    setData((prev) => {
      const updated = [...prev.features.items];
      updated[index] = { ...updated[index], [field]: value };

      return {
        ...prev,
        features: { ...prev.features, items: updated },
      };
    });
  };

  const addFeature = () => {
    setData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        items: [
          ...prev.features.items,
          { label: "New Feature", description: "Description here..." },
        ],
      },
    }));
  };

  const removeFeature = (index: number) => {
    setData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        items: prev.features.items.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-4">
      {/* Features Title */}
      <label className="block text-xs text-slate-400">
        Features Section Title
        <input
          value={data.features.title}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              features: { ...prev.features, title: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      {/* Feature Items */}
      <div className="space-y-4">
        {data.features.items.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-700 bg-slate-900/50 p-3"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-semibold text-slate-300">
                Feature {index + 1}
              </h4>

              {data.features.items.length > 1 && (
                <button
                  onClick={() => removeFeature(index)}
                  className="text-red-400 text-xs hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>

            <label className="block text-xs text-slate-400 mt-2">
              Label
              <input
                value={item.label}
                onChange={(e) => updateItem(index, "label", e.target.value)}
                className="input-base"
              />
            </label>

            <label className="block text-xs text-slate-400 mt-2">
              Description
              <textarea
                value={item.description}
                onChange={(e) =>
                  updateItem(index, "description", e.target.value)
                }
                rows={2}
                className="input-base"
              />
            </label>
          </div>
        ))}
      </div>

      {/* Add Feature Button */}
      <button
        onClick={addFeature}
        className="w-full rounded-full bg-primary px-3 py-2 text-xs font-medium text-slate-950"
      >
        + Add Feature
      </button>
    </div>
  );
}
