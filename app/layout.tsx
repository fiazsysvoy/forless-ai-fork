import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "./providers";
import { Toaster } from "sonner";

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
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          richColors
          position="top-center"
          toastOptions={{
            classNames: {
              actionButton: "!bg-red-600 !text-white hover:!bg-red-700",
              cancelButton: "!bg-slate-700 !text-slate-200 hover:!bg-slate-600",
            },
          }}
        />
      </body>
    </html>
  );
}
