// app/reunions/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Download,
  Share2,
  RotateCcw,
  Copy,
  Check,
  Calendar,
  Clock,
  Users,
  MessageSquare,
} from "lucide-react";
import { AIMeetingMinutes } from "@/app/components/AIMeetingMinutes";
import { ActionsTable } from "@/app/components/ActionsTable";
import { toast } from "@/app/hooks/use-toast";

// Données mock
const meetingData = {
  id: 1,
  title: "Stratégie produit Q4",
  date: "15 janvier 2024",
  duration: "45 minutes",
  participants: [
    { name: "Jean Dupont", role: "PM", avatar: "" },
    { name: "Sophie Martin", role: "Designer", avatar: "" },
    { name: "Thomas Bernard", role: "Dev Lead", avatar: "" },
  ],
  summary:
    "Cette réunion a défini la feuille de route produit pour le Q4 2024. Les principales décisions concernent le lancement de la fonctionnalité de collaboration en temps réel et l'optimisation des performances backend.",
  decisions: [
    "Lancer la beta de collaboration en avril 2024",
    "Reporter la refonte du dashboard au Q1 2025",
    "Allouer 2 sprints à l'optimisation des performances",
  ],
  actions: [
    {
      task: "Préparer le spec technique collaboration",
      assignee: "Thomas Bernard",
      dueDate: "2024-02-01",
      status: "pending",
    },
    {
      task: "Design des nouvelles interfaces",
      assignee: "Sophie Martin",
      dueDate: "2024-02-15",
      status: "in-progress",
    },
    {
      task: "Plan de communication interne",
      assignee: "Jean Dupont",
      dueDate: "2024-01-30",
      status: "pending",
    },
  ],
  blockers: [
    "Validation sécurité pour la collaboration temps réel",
    "Disponibilité des ressources DevOps",
  ],
};

export default function MeetingDetailPage() {
  const params = useParams();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({ title: "Lien copié !" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {meetingData.title}
            </h1>
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {meetingData.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {meetingData.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {meetingData.participants.length} participants
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopyLink}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="ml-2">Partager</span>
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <RotateCcw className="h-4 w-4 mr-2" />
              Régénérer
            </Button>
          </div>
        </div>

        {/* Participants */}
        <div className="flex -space-x-2">
          {meetingData.participants.map((p, i) => (
            <Avatar key={i} className="border-2 border-background">
              <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="minutes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="minutes">Compte rendu IA</TabsTrigger>
          <TabsTrigger value="actions">
            Actions ({meetingData.actions.length})
          </TabsTrigger>
          <TabsTrigger value="transcript">Transcription</TabsTrigger>
        </TabsList>

        <TabsContent value="minutes" className="mt-6 space-y-6">
          <AIMeetingMinutes
            summary={meetingData.summary}
            decisions={meetingData.decisions}
            blockers={meetingData.blockers}
          />
        </TabsContent>

        <TabsContent value="actions" className="mt-6">
          <ActionsTable actions={meetingData.actions} />
        </TabsContent>

        {/* <TabsContent value="transcript" className="mt-6">
          <TranscriptViewer />
        </TabsContent> */}
      </Tabs>

      {/* Badge qualité IA */}
      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Généré par MeetMind IA</p>
              <p className="text-xs text-muted-foreground">
                Score de confiance : 94% - basé sur 32 participants similaires
              </p>
            </div>
            <Badge variant="outline" className="ml-auto">
              Version v2.1
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
