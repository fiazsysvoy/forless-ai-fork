// app/types/brand.ts
export type BrandData = {
  name: string;
  slogan: string;
  palette: {
    primary: string;
    secondary: string;
  };
  font: {
    id: string;
    css: string;
  };
};
