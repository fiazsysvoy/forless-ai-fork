// app/brand/_components/BrandControls.tsx
"use client";

import { PALETTES, FONTS } from "@/app/(app)/brand/brandConfig";

interface BrandControlsProps {
  idea: string;
  onIdeaChange: (value: string) => void;
  selectedPaletteId: string;
  onPaletteChange: (id: string) => void;
  selectedFontId: string;
  onFontChange: (id: string) => void;
  loading: boolean;
  onGenerate: () => void;
}

export default function BrandControls({
  idea,
  onIdeaChange,
  selectedPaletteId,
  onPaletteChange,
  selectedFontId,
  onFontChange,
  loading,
  onGenerate,
}: BrandControlsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Idea input */}
      <div className="md:col-span-2 space-y-2">
        <label className="block text-[11px] text-slate-300">
          Business idea / keywords
        </label>
        <textarea
          value={idea}
          onChange={(e) => onIdeaChange(e.target.value)}
          className="h-24 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs outline-none ring-primary/40 focus:ring-1"
          placeholder="Example: Minimal tea shop for young professionals, calm vibe, affordable."
        />
      </div>

      {/* Palette + font */}
      <div className="space-y-4">
        <div>
          <label className="block text-[11px] text-slate-300">
            Color palette
          </label>
          <div className="mt-1 space-y-1">
            {PALETTES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onPaletteChange(p.id)}
                className={[
                  "flex w-full items-center justify-between rounded-md border px-3 py-1.5 text-[11px]",
                  selectedPaletteId === p.id
                    ? "border-primary bg-slate-900"
                    : "border-slate-700 bg-slate-950 hover:bg-slate-900",
                ].join(" ")}
              >
                <span>{p.label}</span>
                <span className="flex gap-1">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: p.primary }}
                  />
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: p.secondary }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-slate-300">Font style</label>
          <select
            value={selectedFontId}
            onChange={(e) => onFontChange(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] outline-none"
          >
            {FONTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="mt-2 w-full rounded-md bg-primary px-3 py-1.5 text-[11px] font-medium text-slate-950 disabled:opacity-60"
        >
          {loading ? "Generating…" : "Generate brands"}
        </button>
      </div>
    </div>
  );
}
