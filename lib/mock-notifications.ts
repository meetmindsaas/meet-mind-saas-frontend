// lib/mock-notifications.ts
import { Notification } from "@/types/notification";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "CR généré",
    description: "Stratégie produit Q4 - 12 actions identifiées",
    time: new Date(Date.now() - 5 * 60 * 1000), // 5 min
    read: false,
    type: "meeting",
    link: "/reunions/1",
  },
  {
    id: "2",
    title: "Action en retard",
    description: "Préparer le spec technique - échéance aujourd'hui",
    time: new Date(Date.now() - 60 * 60 * 1000), // 1h
    read: false,
    type: "action",
    link: "/reunions/1?action=2",
  },
  {
    id: "3",
    title: "Nouveau membre",
    description: "Thomas a rejoint votre équipe",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h
    read: true,
    type: "system",
  },
  {
    id: "4",
    title: "Mise à jour IA",
    description: "Nouveau modèle disponible : analyse plus précise",
    time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1j
    read: true,
    type: "system",
  },
  {
    id: "5",
    title: "@Jean vous a mentionné",
    description: "Dans la réunion 'Stratégie produit'",
    time: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    type: "mention",
    link: "/reunions/1#mention-123",
  },
];
