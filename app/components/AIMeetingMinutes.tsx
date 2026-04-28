// app/components/AIMeetingMinutes.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Target } from "lucide-react";

interface AIMeetingMinutesProps {
  summary: string;
  decisions: string[];
  blockers: string[];
}

export function AIMeetingMinutes({
  summary,
  decisions,
  blockers,
}: AIMeetingMinutesProps) {
  return (
    <div className="space-y-6">
      {/* Résumé exécutif */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Résumé exécutif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{summary}</p>
        </CardContent>
      </Card>

      {/* Décisions clés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Décisions clés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {decisions.map((decision, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{decision}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Points de blocage */}
      {blockers.length > 0 && (
        <Card className="border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Points de blocage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {blockers.map((blocker, index) => (
                <li key={index} className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>{blocker}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Note IA */}
      <div className="rounded-lg bg-muted p-4 text-sm">
        <p className="text-muted-foreground">
          💡 L&apos;IA a détecté 3 sujets non résolus dans les 5 dernières
          minutes.
          <button className="ml-2 text-primary hover:underline">
            Analyser plus en détail
          </button>
        </p>
      </div>
    </div>
  );
}
