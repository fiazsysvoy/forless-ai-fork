// app/brand/_components/LogoSvg.tsx
"use client";

// Simple SVG logo – not AI, just pure SVG
export default function LogoSvg({
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
