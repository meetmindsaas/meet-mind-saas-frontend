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

export default function ImportPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImport = async () => {
    setIsProcessing(true);
    // Simuler l'appel API
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 2000);
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
              <div className="rounded-lg border-2 border-dashed p-8 text-center">
                <Mic className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Prêt à enregistrer
                </p>
                <Button className="mt-4" variant="destructive">
                  Démarrer l&apos;enregistrement
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-title">Titre de la réunion</Label>
                <Input
                  id="meeting-title"
                  placeholder="Ex: Daily standup - 15/01"
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
              <Select defaultValue="fast">
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
              <Label>Langue</Label>
              <Select defaultValue="fr">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Titre du compte rendu</Label>
            <Input placeholder="Laisser vide pour génération automatique" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
