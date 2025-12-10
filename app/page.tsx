export default function HomePage() {
  return (
    <section className="grid gap-10 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 mb-3">
          Build Websites with AI
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Launch <span className="text-emerald-400">modern websites</span> in
          minutes, not weeks.
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mb-6 max-w-xl">
          ForlessAI is an AI-powered website builder. Describe your idea in a
          few lines and get ready-to-edit pages, sections, and components —
          generated with clean Next.js code and powered by a secure Supabase
          backend.
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 transition"
          >
            Start building your site
          </a>
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-emerald-500 hover:text-emerald-400 transition"
          >
            Continue where I left off
          </a>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          No complex setup. Log in, describe your project, and let ForlessAI
          generate your first pages automatically.
        </p>
      </div>
    </section>
  );
}
