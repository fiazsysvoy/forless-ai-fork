// components/website/sections/Footer.tsx

type Props = {
  brandName: string;
};

export function Footer({ brandName }: Props) {
  return (
    <footer className="border-t border-slate-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 text-xs text-slate-500">
        <span>
          © {new Date().getFullYear()} {brandName}
        </span>
        <span>Made with ❤️ by ForlessAI</span>
      </div>
    </footer>
  );
}
