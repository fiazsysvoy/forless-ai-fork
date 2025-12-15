// components/website/sections/FeaturesSection.tsx
import { withAlpha } from "../theme";

type FeatureItem = {
  label: string;
  description: string;
};

type FeaturesData = {
  title: string;
  items: FeatureItem[];
};

type Props = {
  features: FeaturesData;
  primary: string;
};

export function FeaturesSection({ features, primary }: Props) {
  return (
    <section className="border-t border-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-xl font-semibold">{features.title}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {features.items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
              style={{
                borderColor: withAlpha(primary, 0.22),
              }}
            >
              <div className="text-sm font-medium">{item.label}</div>
              <p className="mt-2 text-xs text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
