// app/reunions/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  Download,
  Share2,
  MoreVertical,
  Star,
  StarOff,
  Archive,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: number;
  status: "completed" | "processing" | "failed";
  actions: number;
  isFavorite: boolean;
  tags: string[];
  summary: string;
}

// Données mock
const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Stratégie produit Q4",
    date: "2024-01-15",
    duration: "45 min",
    participants: 8,
    status: "completed",
    actions: 12,
    isFavorite: true,
    tags: ["Stratégie", "Produit"],
    summary: "Définition de la feuille de route produit pour le Q4",
  },
  {
    id: "2",
    title: "Revue technique sprint 12",
    date: "2024-01-14",
    duration: "1h30",
    participants: 5,
    status: "completed",
    actions: 8,
    isFavorite: false,
    tags: ["Technique", "Sprint"],
    summary: "Review des tickets terminés et planification du prochain sprint",
  },
  {
    id: "3",
    title: "UX/UI design review",
    date: "2024-01-13",
    duration: "1h",
    participants: 4,
    status: "processing",
    actions: 0,
    isFavorite: false,
    tags: ["Design", "UX"],
    summary: "Validation des maquettes pour la nouvelle interface",
  },
  {
    id: "4",
    title: "Daily standup - Équipe frontend",
    date: "2024-01-12",
    duration: "15 min",
    participants: 6,
    status: "completed",
    actions: 3,
    isFavorite: false,
    tags: ["Daily", "Frontend"],
    summary: "Points d'avancement et blocages de l'équipe frontend",
  },
  {
    id: "5",
    title: "Réunion client - Démo v2",
    date: "2024-01-11",
    duration: "1h",
    participants: 12,
    status: "completed",
    actions: 15,
    isFavorite: true,
    tags: ["Client", "Démo"],
    summary: "Présentation des nouvelles fonctionnalités au client",
  },
];

export default function ReunionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [activeTab, setActiveTab] = useState("all");

  const toggleFavorite = (id: string) => {
    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting.id === id
          ? { ...meeting, isFavorite: !meeting.isFavorite }
          : meeting,
      ),
    );
  };

  const archiveMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((meeting) => meeting.id !== id));
    // Ici, appeler l'API pour archiver
  };

  const getStatusBadge = (status: Meeting["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Terminé</Badge>;
      case "processing":
        return (
          <Badge variant="secondary" className="animate-pulse">
            Génération IA...
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Échec</Badge>;
    }
  };

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "favorites" && meeting.isFavorite) ||
      (activeTab === "processing" && meeting.status === "processing");
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes réunions</h1>
          <p className="text-muted-foreground mt-1">
            Gérez et consultez tous vos comptes rendus générés par l&apos;IA
          </p>
        </div>
        <Link href="/import">
          <Button className="w-full md:w-auto">+ Nouvelle réunion</Button>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre ou contenu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="recent">Récentes</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
          <TabsTrigger value="processing">En cours</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredMeetings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Aucune réunion trouvée</p>
                <Link href="/import">
                  <Button variant="link" className="mt-2">
                    Importer votre première réunion
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredMeetings.map((meeting) => (
                <Card
                  key={meeting.id}
                  className="hover:shadow-lg transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleFavorite(meeting.id)}
                            className="mt-1"
                          >
                            {meeting.isFavorite ? (
                              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                            ) : (
                              <StarOff className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                          <div className="flex-1">
                            <Link href={`/reunions/${meeting.id}`}>
                              <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                                {meeting.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              {meeting.summary}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(meeting.date).toLocaleDateString(
                                  "fr-FR",
                                )}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {meeting.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {meeting.participants} participants
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {meeting.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {getStatusBadge(meeting.status)}
                        {meeting.status === "completed" && (
                          <>
                            <Badge variant="secondary">
                              {meeting.actions} actions
                            </Badge>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => archiveMeeting(meeting.id)}
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Archiver
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
