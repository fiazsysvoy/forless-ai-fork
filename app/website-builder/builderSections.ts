// app/website-builder/builderSections.ts

export const builderSections = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "products", label: "Products" },
  { id: "contact", label: "Contact" },
] as const;

export type BuilderSection = (typeof builderSections)[number]["id"];
