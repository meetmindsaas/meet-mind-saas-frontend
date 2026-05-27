// components/NotificationItem.tsx
"use client";

import { Notification } from "@/types/notification";
import {
  Bell,
  Calendar,
  CheckCircle2,
  AtSign,
  Sparkles,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const iconMap = {
  meeting: Calendar,
  action: CheckCircle2,
  mention: AtSign,
  system: Sparkles,
};

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const Icon = iconMap[notification.type] || Bell;
  const isUnread = !notification.read;

  const handleClick = () => {
    if (isUnread) onMarkAsRead(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(notification.id);
  };

  const content = (
    <div
      className={cn(
        "group flex items-start gap-4 p-4 rounded-lg transition-all",
        isUnread ? "bg-muted/30 hover:bg-muted/50" : "hover:bg-muted/20",
        "cursor-pointer border border-transparent hover:border-border",
      )}
      onClick={handleClick}
    >
      <div className="flex-shrink-0">
        <div
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            isUnread
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-sm font-semibold">{notification.title}</h4>
          {isUnread && (
            <Circle className="h-2 w-2 fill-blue-500 text-blue-500" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {notification.description}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(notification.time, {
            addSuffix: true,
            locale: fr,
          })}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-red-500"
        onClick={handleDelete}
      >
        ✕
      </Button>
    </div>
  );

  if (notification.link) {
    return <Link href={notification.link}>{content}</Link>;
  }
  return content;
}
