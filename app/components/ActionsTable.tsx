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
import { CalendarDays, User } from "lucide-react";

interface Action {
  task: string;
  assignee: string;
  dueDate: string;
  status: string;
}

interface ActionsTableProps {
  actions: Action[];
}

export function ActionsTable({ actions }: ActionsTableProps) {
  const [items, setItems] = useState(actions);

  const toggleStatus = (index: number) => {
    const newItems = [...items];
    newItems[index].status =
      newItems[index].status === "completed" ? "pending" : "completed";
    setItems(newItems);
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

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Tâche</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead>Date limite</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((action, index) => (
            <TableRow
              key={index}
              className={action.status === "completed" ? "bg-muted/50" : ""}
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
                  action.task
                )}
              </TableCell>
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
                <div className="flex items-center gap-1 text-sm">
                  <CalendarDays className="h-3 w-3" />
                  {action.dueDate}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(action.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="border-t p-4 flex justify-between">
        <p className="text-sm text-muted-foreground">
          {items.filter((a) => a.status === "completed").length} /{" "}
          {items.length} actions terminées
        </p>
        <Button variant="outline" size="sm">
          + Ajouter une action
        </Button>
      </div>
    </div>
  );
}
