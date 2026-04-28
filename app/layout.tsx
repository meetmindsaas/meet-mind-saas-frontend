// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MeetMind - Comptes rendus IA pour réunions",
  description: "Générez automatiquement des comptes rendus intelligents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex h-screen flex-col">
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />

              <div className="flex flex-col flex-1">
                {" "}
                {/* ✅ FIX */}
                <Header />
                <main className="flex-1 overflow-auto">
                  <div className="h-full">
                    {" "}
                    {/* optionnel */}
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
