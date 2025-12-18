// components/website/sections/AboutSection.tsx
import Image from "next/image";
import { useUnsplashImage } from "../hooks/useUnsplashImage";

type AboutData = {
  title: string;
  body: string;
  imageQuery: string;
};

type Props = {
  about: AboutData;
};

export function AboutSection({ about }: Props) {
  const aboutImage = useUnsplashImage(about.imageQuery);

  return (
    <section id="about" className="border-t border-slate-800 bg-slate-900/40">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">{about.title}</h2>
          <p className="mt-4 text-sm text-slate-300">{about.body}</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          {aboutImage ? (
            <Image
              src={aboutImage}
              alt={about.title}
              width={500}
              height={800}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-slate-800 animate-pulse" />
          )}
        </div>
      </div>
    </section>
  );
}
