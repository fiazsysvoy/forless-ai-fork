// app/brand/_components/BrandGenerator.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type BrandOption = {
  id: string;
  name: string;
  slogan: string;
  primaryColor: string;
  secondaryColor: string;
  font: string;
};

const PALETTES = [
  {
    id: "emerald-slate",
    label: "Emerald + Slate",
    primary: "#10b981",
    secondary: "#0f172a",
  },
  {
    id: "blue-slate",
    label: "Blue + Slate",
    primary: "#0ea5e9",
    secondary: "#020617",
  },
  {
    id: "amber-slate",
    label: "Amber + Slate",
    primary: "#f59e0b",
    secondary: "#111827",
  },
];

const FONTS = [
  {
    id: "sans",
    label: "Sans (Default)",
    css: "system-ui, -apple-system, sans-serif",
  },
  { id: "serif", label: "Serif", css: "Georgia, 'Times New Roman', serif" },
  {
    id: "mono",
    label: "Mono",
    css: "SFMono-Regular, Menlo, Monaco, monospace",
  },
];

interface Props {
  projectId: string;
  projectName?: string | null;
}

export default function BrandGenerator({ projectId, projectName }: Props) {
  const router = useRouter();
  const [idea, setIdea] = useState(projectName || "");
  const [selectedPaletteId, setSelectedPaletteId] = useState("emerald-slate");
  const [selectedFontId, setSelectedFontId] = useState("sans");
  const [generated, setGenerated] = useState<BrandOption[] | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedPalette = useMemo(
    () => PALETTES.find((p) => p.id === selectedPaletteId) ?? PALETTES[0],
    [selectedPaletteId]
  );

  const selectedFont = useMemo(
    () => FONTS.find((f) => f.id === selectedFontId) ?? FONTS[0],
    [selectedFontId]
  );

  function handleGenerate() {
    if (!idea.trim()) {
      alert("Please describe your business idea first.");
      return;
    }

    setLoading(true);

    // Fake “AI” generation on the client
    const options = generateBrandOptions(
      idea,
      selectedPalette.primary,
      selectedPalette.secondary,
      selectedFont.css
    );

    setGenerated(options);
    setLoading(false);
  }

  function handleUse(option: BrandOption) {
    // For now: just push to website builder.
    // Later: call an API to save brand data for this project.
    console.log("Chosen brand for project", projectId, option);

    router.push(`/website-builder?projectId=${projectId}`);
  }

  return (
    <div className="space-y-6 text-xs">
      <div>
        <h1 className="text-xl font-semibold">Brand Generator</h1>
        <p className="mt-1 text-slate-400">
          Configure a color palette and font, then generate name, slogan and a
          simple SVG logo.
        </p>
      </div>

      {/* Controls */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Idea input */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-[11px] text-slate-300">
            Business idea / keywords
          </label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
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
                  onClick={() => setSelectedPaletteId(p.id)}
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
            <label className="block text-[11px] text-slate-300">
              Font style
            </label>
            <select
              value={selectedFontId}
              onChange={(e) => setSelectedFontId(e.target.value)}
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
            onClick={handleGenerate}
            disabled={loading}
            className="mt-2 w-full rounded-md bg-primary px-3 py-1.5 text-[11px] font-medium text-slate-950 disabled:opacity-60"
          >
            {loading ? "Generating…" : "Generate brands"}
          </button>
        </div>
      </div>

      {/* Generated options */}
      {generated && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Generated options</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {generated.map((option) => (
              <BrandCard
                key={option.id}
                option={option}
                onUse={() => handleUse(option)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ——— Helpers ———

function generateBrandOptions(
  idea: string,
  primary: string,
  secondary: string,
  font: string
): BrandOption[] {
  const seed = idea.toLowerCase();

  const coreWord =
    pickWord(seed, ["tea", "brew", "cup", "leaf", "sip"]) ||
    pickWord(seed, ["studio", "lab", "hub", "space"]) ||
    "studio";

  const vibe =
    pickWord(seed, ["calm", "minimal", "fresh", "bright"]) || "modern";

  const nameBases = [
    `${capitalize(vibe)} ${capitalize(coreWord)}`,
    `${capitalize(coreWord)} & Co.`,
    `${capitalize(vibe)} ${capitalize(coreWord)} House`,
  ];

  const slogans = [
    `Where ${vibe} moments begin.`,
    `Crafting your daily ${coreWord}.`,
    `Simple ${coreWord}, steady focus.`,
  ];

  return nameBases.map((name, idx) => ({
    id: `brand-${idx}`,
    name,
    slogan: slogans[idx] ?? slogans[0],
    primaryColor: primary,
    secondaryColor: secondary,
    font,
  }));
}

function pickWord(seed: string, candidates: string[]): string | null {
  for (const c of candidates) {
    if (seed.includes(c)) return c;
  }
  return null;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function BrandCard({
  option,
  onUse,
}: {
  option: BrandOption;
  onUse: () => void;
}) {
  return (
    <div className="flex h-full flex-col justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <LogoSvg
            name={option.name}
            primaryColor={option.primaryColor}
            secondaryColor={option.secondaryColor}
          />
          <div>
            <div
              className="text-sm font-semibold"
              style={{ fontFamily: option.font }}
            >
              {option.name}
            </div>
            <div className="text-[11px] text-slate-400">{option.slogan}</div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
          <span>Palette</span>
          <span className="flex gap-1">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: option.primaryColor }}
            />
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: option.secondaryColor }}
            />
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onUse}
        className="mt-3 w-full rounded-md bg-primary px-3 py-1.5 text-[11px] font-medium text-slate-950"
      >
        Use this brand
      </button>
    </div>
  );
}

// Simple SVG logo – not AI, just pure SVG
function LogoSvg({
  name,
  primaryColor,
  secondaryColor,
}: {
  name: string;
  primaryColor: string;
  secondaryColor: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <svg
      viewBox="0 0 64 64"
      className="h-10 w-10 rounded-md border border-slate-700"
    >
      <defs>
        <linearGradient id="brandGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="64" height="64" fill="url(#brandGradient)" />
      <circle
        cx="32"
        cy="32"
        r="18"
        fill="rgba(15, 23, 42, 0.85)"
        stroke="rgba(148, 163, 184, 0.9)"
      />
      <text
        x="32"
        y="36"
        textAnchor="middle"
        fontSize="16"
        fontWeight="600"
        fill="#e5e7eb"
      >
        {initials}
      </text>
    </svg>
  );
}
