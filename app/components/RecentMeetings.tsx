// app/components/RecentMeetings.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MoreVertical, Download, Share2 } from "lucide-react";
import Link from "next/link";

const mockMeetings = [
  {
    id: 1,
    title: "Stratégie produit Q4",
    date: "2024-01-15",
    duration: "45 min",
    participants: 8,
    status: "completed",
    actions: 12,
  },
  {
    id: 2,
    title: "Revue technique sprint 12",
    date: "2024-01-14",
    duration: "1h30",
    participants: 5,
    status: "completed",
    actions: 8,
  },
  {
    id: 3,
    title: "UX/UI design review",
    date: "2024-01-13",
    duration: "1h",
    participants: 4,
    status: "processing",
    actions: 0,
  },
];

export function RecentMeetings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Réunions récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <Link href={`/reunions/${meeting.id}`}>
                  <h3 className="font-semibold hover:text-primary transition-colors">
                    {meeting.title}
                  </h3>
                </Link>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {meeting.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {meeting.duration}
                  </span>
                  <span>{meeting.participants} participants</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {meeting.status === "processing" ? (
                  <Badge variant="secondary">Génération IA...</Badge>
                ) : (
                  <>
                    <Badge variant="default" className="bg-green-500">
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
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
