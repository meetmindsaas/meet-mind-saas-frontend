// app/components/StatsCards.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileText, CheckCircle2, Zap } from "lucide-react";

const stats = [
  {
    title: "Réunions traitées",
    value: "47",
    icon: FileText,
    trend: "+12 ce mois",
    color: "text-blue-500",
  },
  {
    title: "Heures économisées",
    value: "32h",
    icon: Clock,
    trend: "+8h vs mois dernier",
    color: "text-green-500",
  },
  {
    title: "Taux d'action",
    value: "89%",
    icon: CheckCircle2,
    trend: "+5% amélioration",
    color: "text-purple-500",
  },
  {
    title: "Générations IA",
    value: "128",
    icon: Zap,
    trend: "rapide ⚡",
    color: "text-orange-500",
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
