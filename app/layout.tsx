// app/layout.tsx
"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {isAuthPage ? (
            // Pages d'auth : pas de sidebar ni header
            children
          ) : (
            // Pages protégées : sidebar + header
            <div className="flex h-screen flex-col">
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1">
                  <Header />
                  <main className="flex-1 overflow-auto">
                    <div className="h-full">{children}</div>
                  </main>
                </div>
              </div>
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
