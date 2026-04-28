// app/settings/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  Bell,
  Globe,
  Moon,
  Sun,
  Monitor,
  Palette,
  Volume2,
  Sparkles,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Préférences générales
  const [language, setLanguage] = useState("fr");
  const [timezone, setTimezone] = useState("Europe/Paris");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  // Apparence
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "system";
    return localStorage.getItem("theme") || "system";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);
  const [fontSize, setFontSize] = useState(16);
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState({
    meetingReady: true,
    actionAssigned: true,
    actionOverdue: true,
    weeklyDigest: true,
    productUpdates: false,
  });

  // Son
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(70);

  // Préférences IA
  const [defaultModel, setDefaultModel] = useState("balanced");
  const [autoExtractActions, setAutoExtractActions] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [crLength, setCrLength] = useState("medium");

  const handleSave = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos préférences ont été mises à jour",
        variant: "success",
      });
    }, 1000);
  };

  // Changement de thème
  useEffect(() => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(systemTheme);
      return;
    }

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  // taille de police
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // son des notifications
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/tamtam.mp3");
  }, []);

  // Ajustement du volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = soundVolume / 100;
    }
  }, [soundVolume]);

  const [isPlaying, setIsPlaying] = useState(false);

  const handleTestSound = () => {
    if (!soundEnabled || !audioRef.current) return;

    setIsPlaying(true);
    audioRef.current.currentTime = 0;

    audioRef.current.play().finally(() => {
      setTimeout(() => setIsPlaying(false), 1000);
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground mt-1">
            Personnalisez votre expérience MeetMind
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2" />
            Général
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Apparence
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Sparkles className="h-4 w-4 mr-2" />
            IA
          </TabsTrigger>
          <TabsTrigger value="audio">
            <Volume2 className="h-4 w-4 mr-2" />
            Audio
          </TabsTrigger>
        </TabsList>

        {/* Général */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Langue et région</CardTitle>
              <CardDescription>
                Personnalisez votre expérience linguistique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Langue de l&apos;interface</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fuseau horaire</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">
                        Paris (UTC+1)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        Londres (UTC+0)
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        New York (UTC-5)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Format des dates</Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">
                      DD/MM/YYYY (31/12/2024)
                    </SelectItem>
                    <SelectItem value="MM/DD/YYYY">
                      MM/DD/YYYY (12/31/2024)
                    </SelectItem>
                    <SelectItem value="YYYY-MM-DD">
                      YYYY-MM-DD (2024-12-31)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Préférences de session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Restez connecté</p>
                  <p className="text-sm text-muted-foreground">
                    Rester connecté après fermeture du navigateur
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Timeout de session (inactivité)</Label>
                <Select defaultValue="60">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                    <SelectItem value="120">2 heures</SelectItem>
                    <SelectItem value="never">Jamais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Apparence */}
        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thème</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${
                    theme === "light"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <Sun className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Clair</p>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${
                    theme === "dark"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <Moon className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Sombre</p>
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${
                    theme === "system"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <Monitor className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Système</p>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Affichage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Taille de la police</Label>
                  <span className="text-sm text-muted-foreground">
                    {fontSize}px
                  </span>
                </div>
                <Slider
                  value={[fontSize]}
                  onValueChange={(val: number[]) => setFontSize(val[0])}
                  min={12}
                  max={24}
                  step={1}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mode compact</p>
                  <p className="text-sm text-muted-foreground">
                    Réduire les espacements pour plus d&apos;information
                  </p>
                </div>
                <Switch
                  checked={compactMode}
                  onCheckedChange={setCompactMode}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Animations</p>
                  <p className="text-sm text-muted-foreground">
                    Activer les transitions et animations
                  </p>
                </div>
                <Switch checked={animations} onCheckedChange={setAnimations} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications email</CardTitle>
              <CardDescription>
                Recevez des alertes par email pour les événements importants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">CR généré</p>
                  <p className="text-sm text-muted-foreground">
                    Email quand un compte rendu est prêt
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.meetingReady}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({
                      ...emailNotifications,
                      meetingReady: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Action assignée</p>
                  <p className="text-sm text-muted-foreground">
                    Quand une action vous est assignée
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.actionAssigned}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({
                      ...emailNotifications,
                      actionAssigned: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Action en retard</p>
                  <p className="text-sm text-muted-foreground">
                    Rappel quotidien des actions en retard
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.actionOverdue}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({
                      ...emailNotifications,
                      actionOverdue: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Résumé hebdomadaire</p>
                  <p className="text-sm text-muted-foreground">
                    Récapitulatif de votre activité chaque semaine
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.weeklyDigest}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({
                      ...emailNotifications,
                      weeklyDigest: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mises à jour produit</p>
                  <p className="text-sm text-muted-foreground">
                    Nouveautés et fonctionnalités
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.productUpdates}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({
                      ...emailNotifications,
                      productUpdates: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IA */}
        <TabsContent value="ai" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Modèles IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Modèle par défaut</Label>
                <Select value={defaultModel} onValueChange={setDefaultModel}>
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
                      Premium (analyse approfondie)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Extraction automatique</p>
                  <p className="text-sm text-muted-foreground">
                    Détection et extraction des actions automatique
                  </p>
                </div>
                <Switch
                  checked={autoExtractActions}
                  onCheckedChange={setAutoExtractActions}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Résumé exécutif</p>
                  <p className="text-sm text-muted-foreground">
                    Générer automatiquement un résumé
                  </p>
                </div>
                <Switch
                  checked={includeSummary}
                  onCheckedChange={setIncludeSummary}
                />
              </div>
              <div className="space-y-2">
                <Label>Longueur du compte rendu</Label>
                <Select value={crLength} onValueChange={setCrLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Concis (1-2 pages)</SelectItem>
                    <SelectItem value="medium">Standard (3-5 pages)</SelectItem>
                    <SelectItem value="long">Détaillé (6+ pages)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audio */}
        <TabsContent value="audio" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Son et notifications audio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sons système</p>
                  <p className="text-sm text-muted-foreground">
                    Jouer des sons pour les notifications
                  </p>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Volume des sons</Label>
                  <span className="text-sm text-muted-foreground">
                    {soundVolume}%
                  </span>
                </div>
                <Slider
                  value={[soundVolume]}
                  onValueChange={(val: number[]) => setSoundVolume(val[0])}
                  min={0}
                  max={100}
                  step={5}
                  disabled={!soundEnabled}
                />
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!soundEnabled}
                  onClick={handleTestSound}
                >
                  {isPlaying ? "Lecture..." : "Tester le son"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Le son de notification sera joué
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
