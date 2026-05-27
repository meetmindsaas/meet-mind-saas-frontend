// app/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Upload,
  Settings,
  Mic,
  History,
  Users,
  Star,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/" },
  { icon: Calendar, label: "Mes réunions", href: "/reunions" },
  { icon: Upload, label: "Importer", href: "/import" },
  { icon: Mic, label: "Direct live", href: "/live" },
  { icon: History, label: "Archives", href: "/reunions?status=archived" },
  { icon: Star, label: "Favoris", href: "/reunions?filter=favorites" },
  { icon: Users, label: "Équipe", href: "/team" },
  { icon: Settings, label: "Paramètres", href: "/settings" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
            MeetMind
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-secondary",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4">
            <p className="text-sm font-medium">Crédits IA</p>
            <p className="text-2xl font-bold mt-1">247</p>
            <p className="text-xs text-muted-foreground mt-1">
              minutes restantes
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
