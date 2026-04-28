// app/components/TranscriptViewer.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "./RichTextEditor";
import {
  Search,
  Download,
  Copy,
  Check,
  Mic,
  Sparkles,
  MessageSquare,
  Plus,
  Save,
  Edit3,
  Eye,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Données mock de transcription enrichie avec HTML
const DEFAULT_TRANSCRIPTION_HTML = `
<h2>🎯 Introduction</h2>
<p>Bonjour à tous, merci d'être présents. Aujourd'hui, <strong>nous allons discuter de la stratégie produit pour le Q4</strong>. Les objectifs principaux sont :</p>
<ul>
  <li>Définir la feuille de route</li>
  <li>Allouer les ressources techniques</li>
  <li>Valider les deadlines</li>
</ul>

<h2>📊 Présentation des maquettes</h2>
<p><em>Sophie Martin (Designer)</em> : J'ai préparé une présentation des maquettes pour la nouvelle interface de collaboration.</p>
<div class="bg-muted/30 p-3 rounded-lg my-2">
  <p class="text-sm text-muted-foreground">🔗 <strong>Lien vers le Figma :</strong> <a href="#" class="text-primary">https://figma.com/meetmind/design</a></p>
</div>

<h2>⚙️ Contraintes techniques</h2>
<p><strong>Thomas Bernard (Dev Lead)</strong> : Côté technique, on a identifié quelques contraintes sur l'API :</p>
<ol>
  <li>Latence sur les endpoints de synchronisation</li>
  <li>Limitation de rate sur les appels externes</li>
  <li>Nécessité de prévoir 2 sprints supplémentaires</li>
</ol>

<div class="bg-yellow-500/10 border-l-4 border-yellow-500 p-3 my-3">
  <p class="text-sm font-medium">⚠️ Point d'attention</p>
  <p class="text-sm">La validation sécurité pour la collaboration temps réel est bloquante.</p>
</div>

<h2>✅ Décisions prises</h2>
<p>Jean Dupont (PM) : <mark>D'accord, prenons cette décision. On alloue 2 sprints à l'optimisation des performances.</mark></p>

<h2>📝 Actions à suivre</h2>
<ul>
  <li><input type="checkbox" /> Préparer le spec technique collaboration - <strong>Thomas</strong> (due: 01/02)</li>
  <li><input type="checkbox" /> Design des nouvelles interfaces - <strong>Sophie</strong> (due: 15/02)</li>
  <li><input type="checkbox" /> Plan de communication interne - <strong>Jean</strong> (due: 30/01)</li>
</ul>

<blockquote>
  <p>Sophie Martin : Je peux livrer les maquettes finales d'ici la fin de semaine.</p>
</blockquote>

<hr />

<p class="text-muted-foreground text-sm">✨ <em>Transcription générée automatiquement par MeetMind IA - Dernière mise à jour : 15/01/2024</em></p>
`;

interface Note {
  id: string;
  text: string;
  timestamp: string;
  createdAt: string;
}

export function TranscriptViewer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [editableContent, setEditableContent] = useState(
    DEFAULT_TRANSCRIPTION_HTML,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"transcript" | "notes">(
    "transcript",
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger le contenu sauvegardé depuis localStorage (en utilisant startTransition)
  useEffect(() => {
    // Utiliser requestIdleCallback ou setTimeout pour différer le setState
    const timer = setTimeout(() => {
      const saved = localStorage.getItem("meeting-transcript");
      if (saved && saved !== editableContent) {
        setEditableContent(saved);
      }
      setIsLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sauvegarder le contenu (pas dans un effet, dans une fonction appelée par l'utilisateur)
  const handleSave = () => {
    localStorage.setItem("meeting-transcript", editableContent);
    setIsEditing(false);
    toast({
      title: "Transcription sauvegardée",
      description: "Vos modifications ont été enregistrées",
      variant: "success",
    });
  };

  const handleCopyTranscript = () => {
    // Extraire le texte brut du HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = editableContent;
    const plainText = tempDiv.textContent || tempDiv.innerText;
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    toast({ title: "Transcription copiée !" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([editableContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcription.html";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export effectué" });
  };

  const handleAIAnalyze = () => {
    toast({
      title: "Analyse IA en cours",
      description:
        "L'IA analyse la transcription pour extraire les points clés...",
    });
    setTimeout(() => {
      toast({
        title: "Analyse terminée",
        description: "3 points clés ont été identifiés",
        variant: "success",
      });
    }, 2000);
  };

  const handleAddNote = () => {
    if (!currentNote.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      text: currentNote,
      timestamp: new Date().toLocaleTimeString(),
      createdAt: new Date().toLocaleString(),
    };

    setNotes([...notes, newNote]);
    setCurrentNote("");
    toast({ title: "Note ajoutée", variant: "success" });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    toast({ title: "Note supprimée" });
  };

  // Afficher un squelette pendant le chargement
  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Mic className="h-5 w-5 text-primary" />
            <CardTitle>Transcription complète</CardTitle>
            <Badge variant="secondary" className="ml-2">
              {Math.floor(editableContent.length / 1000)}k caractères
            </Badge>
          </div>
          <div className="flex gap-2">
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-48"
              />
            </div>

            {/* Boutons d'action */}
            <Button variant="outline" size="sm" onClick={handleCopyTranscript}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleAIAnalyze}>
              <Sparkles className="h-4 w-4 mr-1" />
              Analyser
            </Button>
            {!isEditing ? (
              <Button size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-1" />
                Éditer
              </Button>
            ) : (
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Sauvegarder
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "transcript" | "notes")}
          className="w-full"
        >
          <TabsList className="mx-4 mt-4 w-full max-w-md">
            <TabsTrigger value="transcript">
              <Eye className="h-4 w-4 mr-2" />
              Transcription
            </TabsTrigger>
            <TabsTrigger value="notes">
              <MessageSquare className="h-4 w-4 mr-2" />
              Notes
              {notes.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {notes.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Transcription - Mode édition ou visualisation */}
          <TabsContent value="transcript" className="m-0">
            {isEditing ? (
              <div className="p-4">
                <RichTextEditor
                  content={editableContent}
                  onChange={setEditableContent}
                  placeholder="Transcription de la réunion..."
                />
              </div>
            ) : (
              <div className="max-h-[550px] overflow-y-auto p-4">
                {/* Recherche et surlignage */}
                {searchQuery && (
                  <div className="mb-3 text-sm text-muted-foreground">
                    Résultats pour &quot;{searchQuery}&quot;
                  </div>
                )}

                {/* Affichage du HTML avec surlignage de la recherche */}
                <div
                  className="prose prose-sm dark:prose-invert max-w-none transcript-content"
                  dangerouslySetInnerHTML={{
                    __html: searchQuery
                      ? editableContent.replace(
                          new RegExp(`(${searchQuery})`, "gi"),
                          `<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">$1</mark>`,
                        )
                      : editableContent,
                  }}
                />
              </div>
            )}
          </TabsContent>

          {/* Notes */}
          <TabsContent value="notes" className="m-0">
            <div className="p-4 space-y-4">
              {/* Ajout de note */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter une note personnelle..."
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                />
                <Button onClick={handleAddNote}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Liste des notes */}
              <div className="space-y-3 max-h-[450px] overflow-y-auto">
                {notes.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Aucune note pour le moment</p>
                    <p className="text-sm">
                      Ajoutez des notes personnelles à cette transcription
                    </p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs">
                          🕐 {note.timestamp}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
                        >
                          ✕
                        </Button>
                      </div>
                      <p className="text-sm">{note.text}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        📅 {note.createdAt}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Pied de page - Statistiques */}
      <div className="border-t p-3 bg-muted/30 flex justify-between items-center text-xs text-muted-foreground flex-wrap gap-2">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            🎙 Transcription automatique par IA
          </span>
          <span className="flex items-center gap-1">⏱ Durée totale: 1h15</span>
          <span className="flex items-center gap-1">📝 Confiance: 94%</span>
        </div>
        <div>
          <Button variant="link" size="sm" className="text-xs h-auto p-0">
            Signaler une erreur
          </Button>
        </div>
      </div>
    </Card>
  );
}
