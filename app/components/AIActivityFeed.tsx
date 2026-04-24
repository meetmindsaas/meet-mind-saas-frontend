// app/components/AIActivityFeed.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

interface Activity {
  id: string;
  type: "meeting_created" | "action_completed" | "insight" | "trend";
  title: string;
  description: string;
  time: string;
  meetingId?: string;
  icon: React.ReactNode;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "meeting_created",
    title: "Nouveau compte rendu",
    description: "Stratégie produit Q4 - 12 actions identifiées",
    time: "Il y a 2 heures",
    meetingId: "1",
    icon: <FileText className="h-4 w-4 text-blue-500" />,
  },
  {
    id: "2",
    type: "action_completed",
    title: "Action terminée",
    description: "Thomas a complété 'Préparer le spec technique'",
    time: "Il y a 3 heures",
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  },
  {
    id: "3",
    type: "insight",
    title: "Insight IA",
    description: "3 réunions mentionnent la même problématique technique",
    time: "Il y a 5 heures",
    icon: <Sparkles className="h-4 w-4 text-purple-500" />,
  },
  {
    id: "4",
    type: "trend",
    title: "Tendance détectée",
    description: "Les décisions sont prises 40% plus rapidement",
    time: "Hier",
    icon: <TrendingUp className="h-4 w-4 text-orange-500" />,
  },
  {
    id: "5",
    type: "meeting_created",
    title: "Nouveau compte rendu",
    description: "Revue technique sprint 12 - 8 actions",
    time: "Hier",
    meetingId: "2",
    icon: <FileText className="h-4 w-4 text-blue-500" />,
  },
];

export function AIActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [isGenerating, setIsGenerating] = useState(false);

  // Simuler une activité IA en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && !isGenerating) {
        setIsGenerating(true);
        setTimeout(() => {
          const newActivity: Activity = {
            id: Date.now().toString(),
            type: "insight",
            title: "Nouvelle analyse IA",
            description:
              "L'IA a détecté un schéma récurrent dans vos décisions",
            time: "À l'instant",
            icon: <Sparkles className="h-4 w-4 text-purple-500" />,
          };
          setActivities((prev) => [newActivity, ...prev.slice(0, 4)]);
          setIsGenerating(false);
        }, 2000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const getActivityLink = (activity: Activity) => {
    if (activity.meetingId) {
      return `/reunions/${activity.meetingId}`;
    }
    return "#";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Fil d&apos;activité IA
        </CardTitle>
        {isGenerating && (
          <Badge variant="secondary" className="animate-pulse">
            Analyse en cours...
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={getActivityLink(activity)}
              className="block group"
            >
              <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    {activity.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {activity.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Statistiques IA */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">87%</p>
              <p className="text-xs text-muted-foreground">Précision IA</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">2.4k</p>
              <p className="text-xs text-muted-foreground">Actions suivies</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
