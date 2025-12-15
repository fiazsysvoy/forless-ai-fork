// components/website/theme.ts
import type React from "react";

export type Theme = {
  primary?: string; // e.g. "#10b981"
  secondary?: string; // e.g. "#0f172a"
  primaryHover?: string; // optional; computed if missing
  fontFamily?: string;
};

type ResolvedTheme = {
  style: React.CSSProperties;
  primary: string;
  primaryHover: string;
  secondary: string;
};

export function resolveTheme(theme?: Theme): ResolvedTheme {
  const computedPrimaryHover =
    theme?.primaryHover ??
    (theme?.primary ? lightenHex(theme.primary, 12) : undefined);

  const style: React.CSSProperties = {
    ...(theme?.primary ? cssVar("--color-primary", theme.primary) : {}),
    ...(computedPrimaryHover
      ? cssVar("--color-primary-hover", computedPrimaryHover)
      : {}),
    ...(theme?.secondary ? cssVar("--color-secondary", theme.secondary) : {}),
    ...(theme?.fontFamily ? { fontFamily: theme.fontFamily } : {}),
  };

  const primary = theme?.primary ?? "var(--color-primary)";
  const primaryHover = computedPrimaryHover ?? "var(--color-primary-hover)";
  const secondary = theme?.secondary ?? "var(--color-secondary)";

  return { style, primary, primaryHover, secondary };
}

/** ---------- Color helpers ---------- */

export function cssVar(name: string, value: string): React.CSSProperties {
  return { [name as any]: value } as React.CSSProperties;
}

// Supports hex ("#rrggbb") or CSS var string ("var(--color-primary)")
export function withAlpha(color: string, alpha: number): string {
  if (color.startsWith("var(")) {
    // can't compute rgba from css var without extra work; use it as-is
    return color;
  }
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clamp(alpha, 0, 1)})`;
}

export function lightenHex(hex: string, amountPct: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const amt = clamp(amountPct, 0, 100) / 100;
  const r = Math.round(rgb.r + (255 - rgb.r) * amt);
  const g = Math.round(rgb.g + (255 - rgb.g) * amt);
  const b = Math.round(rgb.b + (255 - rgb.b) * amt);
  return rgbToHex(r, g, b);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "").trim();
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const v = clamp(Math.round(x), 0, 255).toString(16);
        return v.length === 1 ? "0" + v : v;
      })
      .join("")
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
