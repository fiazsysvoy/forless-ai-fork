// app/brand/brandConfig.ts

export type BrandOption = {
  id: string;
  name: string;
  slogan: string;
  primaryColor: string;
  secondaryColor: string;
  font: string;
};

export type Palette = {
  id: string;
  label: string;
  primary: string;
  secondary: string;
};

export type BrandFont = {
  id: string;
  label: string;
  css: string;
};
export const PALETTES: Palette[] = [
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

export const FONTS: BrandFont[] = [
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

export function generateBrandOptions(
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
