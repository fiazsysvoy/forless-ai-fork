"use client";

import { WebsiteData } from "@/lib/types/websiteTypes";

export type AboutSectionFormProps = {
  data: WebsiteData;
  setData: React.Dispatch<React.SetStateAction<WebsiteData>>;
};

export function AboutSectionForm({ data, setData }: AboutSectionFormProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs text-slate-400">
        About section title
        <input
          value={data.about.title}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              about: { ...d.about, title: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      <label className="block text-xs text-slate-400">
        About text
        <textarea
          value={data.about.body}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              about: { ...d.about, body: e.target.value },
            }))
          }
          rows={4}
          className="input-base"
        />
      </label>

      <label className="block text-xs text-slate-400">
        About image keyword (Unsplash)
        <input
          value={data.about.imageQuery}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              about: { ...d.about, imageQuery: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>
    </div>
  );
}
