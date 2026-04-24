// app/components/QuickImport.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Upload, Link, Mic, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "../hooks/use-toast";

export function QuickImport() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [meetingLink, setMeetingLink] = useState("");

  const simulateImport = async () => {
    setIsProcessing(true);
    setProgress(0);

    for (let i = 0; i <= 100; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProgress(i);
    }

    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Import réussi !",
        description: "Votre réunion est en cours de traitement",
        variant: "success",
      });
      router.push("/reunions");
    }, 500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await simulateImport();
    }
  };

  const handleLinkImport = async () => {
    if (meetingLink) {
      await simulateImport();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import rapide</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">
              <Upload className="h-3 w-3 mr-1" />
              Fichier
            </TabsTrigger>
            <TabsTrigger value="link">
              <Link className="h-3 w-3 mr-1" />
              Lien
            </TabsTrigger>
            <TabsTrigger value="record">
              <Mic className="h-3 w-3 mr-1" />
              Enreg.
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept="audio/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload-quick"
                disabled={isProcessing}
              />
              <label
                htmlFor="file-upload-quick"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Cliquez pour importer
                </span>
                <span className="text-xs text-muted-foreground">
                  MP3, WAV, MP4 (max 500MB)
                </span>
              </label>
            </div>
          </TabsContent>

          <TabsContent value="link" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-link-quick">Lien Zoom/Meet/Teams</Label>
              <Input
                id="meeting-link-quick"
                placeholder="https://zoom.us/j/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <Button
              onClick={handleLinkImport}
              disabled={!meetingLink || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Import...
                </>
              ) : (
                "Importer"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="record" className="mt-4">
            <div className="text-center p-6">
              <Mic className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                Enregistrement direct depuis le navigateur
              </p>
              <Button
                variant="outline"
                className="mt-4"
                disabled={isProcessing}
              >
                Démarrer l&apos;enregistrement
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {isProcessing && (
          <div className="mt-4 space-y-2">
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground text-center">
              {progress < 30 && "Téléchargement..."}
              {progress >= 30 && progress < 60 && "Transcription..."}
              {progress >= 60 && "Génération du CR..."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
