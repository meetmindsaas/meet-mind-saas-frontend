// app/components/ActionsTable.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CalendarDays,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Clock,
  Flag,
} from "lucide-react";
import { AddActionModal } from "./AddActionModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface Action {
  id?: string;
  task: string;
  assignee: string;
  dueDate: string;
  status: string;
  priority?: string;
  description?: string;
  createdAt?: string;
}

interface ActionsTableProps {
  actions: Action[];
  onAddAction?: (action: Action) => void;
  onUpdateAction?: (action: Action) => void;
  onDeleteAction?: (actionId: string) => void;
  meetingTitle?: string;
  participants?: { name: string; role: string }[];
  readOnly?: boolean;
}

const getPriorityBadge = (priority?: string) => {
  switch (priority) {
    case "urgent":
      return (
        <Badge variant="destructive" className="animate-pulse">
          ⚠️ Urgente
        </Badge>
      );
    case "high":
      return <Badge className="bg-orange-500">Haute</Badge>;
    case "medium":
      return <Badge className="bg-blue-500">Moyenne</Badge>;
    case "low":
      return <Badge variant="outline">Basse</Badge>;
    default:
      return null;
  }
};

const getPriorityIcon = (priority?: string) => {
  switch (priority) {
    case "urgent":
      return <AlertCircle className="h-3 w-3 text-red-500" />;
    case "high":
      return <Flag className="h-3 w-3 text-orange-500" />;
    case "medium":
      return <Flag className="h-3 w-3 text-blue-500" />;
    default:
      return null;
  }
};

import { AlertCircle } from "lucide-react";

export function ActionsTable({
  actions: initialActions,
  onAddAction,
  onUpdateAction,
  onDeleteAction,
  meetingTitle = "Réunion",
  participants = [],
  readOnly = false,
}: ActionsTableProps) {
  const [actions, setActions] = useState<Action[]>(initialActions);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleStatus = (index: number) => {
    const newActions = [...actions];
    const newStatus =
      newActions[index].status === "completed" ? "pending" : "completed";
    newActions[index].status = newStatus;
    setActions(newActions);

    if (onUpdateAction) {
      onUpdateAction(newActions[index]);
    }

    toast({
      title: newStatus === "completed" ? "Action terminée" : "Action réouverte",
      description:
        newStatus === "completed" ? "Bravo !" : "L'action a été réouverte",
      variant: "success",
    });
  };

  const handleAddAction = (
    newAction: Omit<Action, "id" | "status" | "createdAt">,
  ) => {
    const actionWithMetadata: Action = {
      ...newAction,
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const updatedActions = [...actions, actionWithMetadata];
    setActions(updatedActions);

    if (onAddAction) {
      onAddAction(actionWithMetadata);
    }

    toast({
      title: "Action ajoutée",
      description: `"${newAction.task}" a été ajoutée avec succès`,
      variant: "success",
    });
  };

  const handleDeleteAction = (index: number, actionId?: string) => {
    const deletedAction = actions[index];
    const newActions = actions.filter((_, i) => i !== index);
    setActions(newActions);

    if (onDeleteAction && actionId) {
      onDeleteAction(actionId);
    }

    toast({
      title: "Action supprimée",
      description: `"${deletedAction.task}" a été supprimée`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Terminé</Badge>;
      case "in-progress":
        return <Badge variant="secondary">En cours</Badge>;
      default:
        return <Badge variant="outline">À faire</Badge>;
    }
  };

  const getDueDateStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) return "overdue";
    if (diffDays <= 3) return "soon";
    return "ok";
  };

  const completedCount = actions.filter((a) => a.status === "completed").length;

  return (
    <div className="space-y-4">
      {/* En-tête avec bouton Ajouter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Actions à suivre</h3>
          <Badge variant="secondary" className="text-sm">
            {completedCount} / {actions.length} terminées
          </Badge>
        </div>
        {!readOnly && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter une action
          </Button>
        )}
      </div>

      {/* Barre de progression */}
      {actions.length > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progression</span>
            <span>{Math.round((completedCount / actions.length) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${(completedCount / actions.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Tableau des actions */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Tâche</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Date limite</TableHead>
              <TableHead>Statut</TableHead>
              {!readOnly && <TableHead className="w-12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={readOnly ? 6 : 7}
                  className="text-center py-12 text-muted-foreground"
                >
                  <Plus className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Aucune action pour le moment</p>
                  {!readOnly && (
                    <Button
                      variant="link"
                      onClick={() => setIsModalOpen(true)}
                      className="mt-2"
                    >
                      Créer la première action
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              actions.map((action, index) => {
                const dueDateStatus = getDueDateStatus(action.dueDate);
                return (
                  <TableRow
                    key={action.id || index}
                    className={
                      action.status === "completed" ? "bg-muted/50" : ""
                    }
                  >
                    <TableCell>
                      <Checkbox
                        checked={action.status === "completed"}
                        onCheckedChange={() => toggleStatus(index)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {action.status === "completed" ? (
                        <span className="line-through text-muted-foreground">
                          {action.task}
                        </span>
                      ) : (
                        <div className="space-y-1">
                          <span>{action.task}</span>
                          {action.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {action.description}
                            </p>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getPriorityBadge(action.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {action.assignee.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{action.assignee}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`flex items-center gap-1 text-sm ${
                          dueDateStatus === "overdue"
                            ? "text-red-500"
                            : dueDateStatus === "soon"
                              ? "text-orange-500"
                              : "text-muted-foreground"
                        }`}
                      >
                        <CalendarDays className="h-3 w-3" />
                        {action.dueDate}
                        {dueDateStatus === "overdue" && (
                          <Badge
                            variant="destructive"
                            className="text-[10px] ml-1"
                          >
                            En retard
                          </Badge>
                        )}
                        {dueDateStatus === "soon" &&
                          action.status !== "completed" && (
                            <Clock className="h-3 w-3 ml-1" />
                          )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(action.status)}</TableCell>
                    {!readOnly && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() =>
                                handleDeleteAction(index, action.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal d'ajout */}
      <AddActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddAction}
        meetingTitle={meetingTitle}
        participants={participants}
      />
    </div>
  );
}
