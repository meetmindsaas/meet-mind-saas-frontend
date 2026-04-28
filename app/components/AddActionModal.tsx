// app/components/AddActionModal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Sparkles,
  UserPlus,
  Clock,
  Flag,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Zap,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface AddActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (action: {
    task: string;
    assignee: string;
    dueDate: string;
    priority: "low" | "medium" | "high" | "urgent";
    description?: string;
  }) => void;
  meetingTitle: string;
  participants: { name: string; role: string }[];
}

// Suggestions IA basées sur le contexte de la réunion
const getAISuggestions = (meetingTitle: string) => {
  const suggestions = {
    "Stratégie produit": [
      "Planifier la revue de roadmap trimestrielle",
      "Organiser une session de priorisation des fonctionnalités",
      "Préparer le pitch pour la direction",
    ],
    "Revue technique": [
      "Réviser l'architecture de l'API",
      "Planifier la mise à jour des dépendances",
      "Organiser un audit de sécurité",
    ],
    default: [
      "Documenter la décision dans Notion",
      "Planifier le suivi avec l'équipe",
      "Créer un ticket dans le backlog",
    ],
  };

  for (const [key, value] of Object.entries(suggestions)) {
    if (meetingTitle.includes(key)) {
      return value;
    }
  }
  return suggestions.default;
};

export function AddActionModal({
  isOpen,
  onClose,
  onAdd,
  meetingTitle,
  participants,
}: AddActionModalProps) {
  const [task, setTask] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [priority, setPriority] = useState<
    "low" | "medium" | "high" | "urgent"
  >("medium");
  const [description, setDescription] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showAIPanel, setShowAIPanel] = useState(false);

  // Suggestions IA
  const suggestions = getAISuggestions(meetingTitle);

  // Générer une suggestion IA améliorée
  const generateAISuggestion = async () => {
    setIsAILoading(true);
    setTimeout(() => {
      const randomSuggestion =
        suggestions[Math.floor(Math.random() * suggestions.length)];
      setAiSuggestion(randomSuggestion);
      setIsAILoading(false);
      toast({
        title: "Suggestion IA générée",
        description: "Basée sur le contexte de la réunion",
        variant: "success",
      });
    }, 1000);
  };

  const handleSubmit = () => {
    if (!task.trim()) {
      toast({
        title: "Champ requis",
        description: "Veuillez saisir une tâche",
        variant: "destructive",
      });
      return;
    }

    if (!assignee) {
      toast({
        title: "Responsable requis",
        description: "Veuillez assigner un responsable",
        variant: "destructive",
      });
      return;
    }

    onAdd({
      task: task.trim(),
      assignee,
      dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : "",
      priority,
      description: description.trim() || undefined,
    });

    // Réinitialiser le formulaire
    setTask("");
    setAssignee("");
    setDueDate(undefined);
    setPriority("medium");
    setDescription("");
    setAiSuggestion("");
    onClose();
  };

  const applyAISuggestion = () => {
    if (aiSuggestion) {
      setTask(aiSuggestion);
      setShowAIPanel(false);
      toast({
        title: "Suggestion appliquée",
        description: "Vous pouvez maintenant modifier le texte",
      });
    }
  };

  const getPriorityIcon = (p: string) => {
    switch (p) {
      case "urgent":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "high":
        return <Flag className="h-4 w-4 text-orange-500" />;
      case "medium":
        return <Flag className="h-4 w-4 text-blue-500" />;
      default:
        return <Flag className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityLabel = (p: string) => {
    switch (p) {
      case "urgent":
        return "Urgente";
      case "high":
        return "Haute";
      case "medium":
        return "Moyenne";
      default:
        return "Basse";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Zap className="h-5 w-5 text-primary" />
            Ajouter une action
          </DialogTitle>
          <DialogDescription>
            Créez une nouvelle tâche à partir de cette réunion. L&apos;action
            sera visible par tous les membres de l&apos;équipe.
          </DialogDescription>
        </DialogHeader>

        {/* Panneau IA - Suggestions intelligentes */}
        {!showAIPanel ? (
          <Button
            variant="outline"
            className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/5"
            onClick={() => setShowAIPanel(true)}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Générer une suggestion avec l&apos;IA
          </Button>
        ) : (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Assistant IA</span>
                <Badge variant="secondary" className="text-xs">
                  Beta
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIPanel(false)}
              >
                ✕
              </Button>
            </div>

            {aiSuggestion ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Voici une suggestion basée sur le contexte de votre réunion :
                </p>
                <div className="rounded-lg bg-background p-3 border">
                  <p className="text-sm">{aiSuggestion}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={applyAISuggestion}>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Utiliser cette suggestion
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={generateAISuggestion}
                    disabled={isAILoading}
                  >
                    {isAILoading ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3 mr-1" />
                    )}
                    Autre suggestion
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Sparkles className="h-8 w-8 mx-auto text-primary/50 mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  L&apos;IA analyse votre réunion pour générer une suggestion
                  pertinente
                </p>
                <Button onClick={generateAISuggestion} disabled={isAILoading}>
                  {isAILoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Générer une suggestion
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4 py-4">
          {/* Tâche */}
          <div className="space-y-2">
            <Label htmlFor="task" className="flex items-center gap-1">
              Tâche <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="task"
              placeholder="Ex: Préparer la présentation pour la revue client..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Assignation */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="assignee" className="flex items-center gap-1">
                <UserPlus className="h-3 w-3" />
                Responsable <span className="text-red-500">*</span>
              </Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un responsable" />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((p) => (
                    <SelectItem key={p.name} value={p.name}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">
                            {p.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{p.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {p.role}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priorité */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="flex items-center gap-1">
                <Flag className="h-3 w-3" />
                Priorité
              </Label>
              <Select
                value={priority}
                onValueChange={(v: "low" | "medium" | "high" | "urgent") =>
                  setPriority(v)
                }
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(priority)}
                      <span>{getPriorityLabel(priority)}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-gray-400" />
                      Basse
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-blue-500" />
                      Moyenne
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-orange-500" />
                      Haute
                    </div>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      Urgente
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date d'échéance */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              Date limite
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate
                    ? format(dueDate, "PPP", { locale: fr })
                    : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Description (optionnelle)
            </Label>
            <Textarea
              id="description"
              placeholder="Ajoutez des détails, des liens ou des ressources..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none text-sm"
            />
          </div>

          {/* Bloc info */}
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-3 w-3" />
              <span className="font-medium">Informations</span>
            </div>
            <p>
              L&apos;action apparaîtra dans le tableau des actions de cette
              réunion. Un email de notification sera envoyé au responsable.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Ajouter l&apos;action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
