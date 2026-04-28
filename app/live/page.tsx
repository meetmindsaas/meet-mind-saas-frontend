// app/live/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Square, FileText, Volume2 } from "lucide-react";
import { LiveTranscription } from "../components/LiveTranscription";

export default function LivePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Ici, logique réelle d'enregistrement avec Web Speech API ou WebSocket
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Réunion en direct</h1>
        <p className="text-muted-foreground mt-1">
          Transcription temps réel et génération automatique
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contrôle principal */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Session live</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="relative inline-block">
                <div
                  className={`absolute inset-0 rounded-full ${isRecording ? "animate-pulse bg-red-500/20" : ""}`}
                />
                <Button
                  size="lg"
                  variant={isRecording ? "destructive" : "default"}
                  className="h-24 w-24 rounded-full"
                  onClick={toggleRecording}
                >
                  {isRecording ? (
                    <Square className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
              </div>
              <p className="mt-3 font-medium">
                {isRecording
                  ? "Enregistrement en cours..."
                  : "Prêt à enregistrer"}
              </p>
              {isRecording && (
                <Badge variant="destructive" className="mt-2">
                  <Volume2 className="h-3 w-3 mr-1 animate-pulse" />
                  Microphone actif
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Statistiques en direct</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>⏱ Durée: 00:00:00</p>
                <p>🎙 Participants: 4 détectés</p>
                <p>📝 Mots transcrits: 0</p>
              </div>
            </div>

            {!isRecording && transcript && (
              <Button className="w-full" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Générer le compte rendu
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Transcription en direct */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Transcription temps réel
              {isRecording && <Badge variant="secondary">En direct</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LiveTranscription
              isActive={isRecording}
              onTranscriptUpdate={setTranscript}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
