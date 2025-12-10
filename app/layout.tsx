import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "./providers";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ForlessAI",
  description: "AI-powered website builder with Supabase auth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
              <div className=" mx-auto px-4 py-8 sm:py-10">{children}</div>
            </main>

            <footer className="border-t border-slate-800 bg-bg-card mt-8">
              <div className="max-w-5xl mx-auto px-4 py-4 text-xs text-slate-500 flex justify-between items-center">
                <span>© {new Date().getFullYear()} ForlessAI</span>
                <span className="hidden sm:inline">
                  Built with Next.js & Supabase
                </span>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
