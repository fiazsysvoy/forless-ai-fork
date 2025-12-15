// components/website/sections/Navbar.tsx
// import Link from "next/link";

type Props = {
  brandName: string;
  offersTitle: string;
};

export function Navbar({ brandName, offersTitle }: Props) {
  return (
    <header className="border-b border-slate-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="font-semibold">{brandName}</div>
        <nav className="hidden gap-6 text-sm md:flex">
          <a href="#about">About</a>
          <a href="#offers">{offersTitle}</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
