// app/import/page.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Link, Mic, Loader2, CheckCircle2 } from "lucide-react";
import { Dropzone } from "../components/Dropzone";
import { AudioRecorder } from "../components/AudioRecorder";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function ImportPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [selectedModel, setSelectedModel] = useState("balanced");

  const handleImport = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      toast({
        title: "Import réussi",
        description: "Redirection vers le compte rendu...",
        variant: "success",
      });
      setTimeout(() => {
        setSuccess(false);
        router.push("/reunions");
      }, 2000);
    }, 2000);
  };

  const handleRecordingComplete = async (audioBlob: Blob, duration: number) => {
    setIsProcessing(true);

    try {
      // Créer un FormData pour envoyer l'enregistrement
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("language", selectedLanguage);
      formData.append("duration", duration.toString());
      formData.append("title", meetingTitle || "Enregistrement direct");

      // Envoyer à l'API pour transcription
      const response = await fetch("/api/transcription", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Enregistrement soumis",
          description: "Transcription en cours...",
          variant: "success",
        });

        // Rediriger vers la page de traitement
        router.push(`/reunions/processing/${data.transcriptionId}`);
      } else {
        throw new Error(data.error || "Erreur lors du traitement");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Importer une réunion
        </h1>
        <p className="text-muted-foreground mt-1">
          L&apos;IA va transcrire et générer un compte rendu structuré
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Fichier
          </TabsTrigger>
          <TabsTrigger value="link">
            <Link className="h-4 w-4 mr-2" />
            Lien
          </TabsTrigger>
          <TabsTrigger value="mic">
            <Mic className="h-4 w-4 mr-2" />
            Enregistrement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload audio ou vidéo</CardTitle>
              <CardDescription>
                Formats supportés : MP3, WAV, M4A, MP4, MOV (max 500MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dropzone onUpload={handleImport} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="link" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lien de réunion</CardTitle>
              <CardDescription>
                Collez le lien Zoom, Google Meet ou Teams
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meeting-link">URL de la réunion</Label>
                <Input
                  id="meeting-link"
                  placeholder="https://zoom.us/j/..."
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passcode">Code d&apos;accès (optionnel)</Label>
                <Input id="passcode" type="password" placeholder="123456" />
              </div>
              <Button
                onClick={handleImport}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Récupération en cours...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Importé avec succès !
                  </>
                ) : (
                  "Importer la réunion"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Enregistrement direct</CardTitle>
              <CardDescription>
                Enregistrez votre réunion en temps réel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-6">
                <AudioRecorder
                  onRecordingComplete={handleRecordingComplete}
                  maxDuration={600} // 10 minutes max
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-title">
                  Titre de la réunion (optionnel)
                </Label>
                <Input
                  id="meeting-title"
                  placeholder="Ex: Daily standup - 15/01"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres IA avancés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Modèle IA</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">
                    Rapide (économie de crédits)
                  </SelectItem>
                  <SelectItem value="balanced">
                    Équilibré (recommandé)
                  </SelectItem>
                  <SelectItem value="premium">
                    Premium (analyse profonde)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Langue de transcription</Label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Titre du compte rendu</Label>
            <Input
              placeholder="Laisser vide pour génération automatique"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
