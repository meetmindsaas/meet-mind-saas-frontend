// types/notification.ts
export interface Notification {
  id: string;
  title: string;
  description: string;
  time: Date;
  read: boolean;
  type: "meeting" | "action" | "mention" | "system";
  link?: string; // Lien vers la ressource (réunion, action, etc.)
  metadata?: Record<string, unknown>;
}
