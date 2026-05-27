// app/notifications/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCheck, Trash2, Inbox, BellRing, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { NotificationItem } from "@/app/components/NotificationItem";
import { mockNotifications } from "@/lib/mock-notifications";
import { Notification } from "@/types/notification";
import Link from "next/link";

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Filtrage selon l'onglet
  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") return notifications.filter((n) => !n.read);
    if (activeTab === "meetings")
      return notifications.filter((n) => n.type === "meeting");
    if (activeTab === "actions")
      return notifications.filter((n) => n.type === "action");
    if (activeTab === "mentions")
      return notifications.filter((n) => n.type === "mention");
    return notifications;
  }, [notifications, activeTab]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    toast({ title: "Notification marquée comme lue", variant: "success" });
  };

  const markAllAsRead = () => {
    setIsLoading(true);
    setTimeout(() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast({
        title: "Toutes les notifications ont été marquées comme lues",
        variant: "success",
      });
      setIsLoading(false);
    }, 500);
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast({ title: "Notification supprimée" });
  };

  const deleteAllRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
    toast({ title: "Notifications lues supprimées" });
  };

  const deleteAll = () => {
    setNotifications([]);
    toast({ title: "Toutes les notifications ont été supprimées" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Suivez l&apos;activité de votre équipe et restez informé
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0 || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCheck className="h-4 w-4 mr-2" />
            )}
            Tout marquer comme lu
          </Button>
          <Button
            variant="outline"
            onClick={deleteAllRead}
            disabled={notifications.filter((n) => n.read).length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer les lues
          </Button>
          <Button
            variant="outline"
            onClick={deleteAll}
            disabled={notifications.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Tout supprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-normal">
            <BellRing className="h-4 w-4" />
            Centre de notifications
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {unreadCount} non lue(s)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="unread">Non lues</TabsTrigger>
              <TabsTrigger value="meetings">Réunions</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="mentions">Mentions</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Inbox className="h-12 w-12 mb-3 opacity-30" />
                  <p className="text-sm">
                    Aucune notification dans cette catégorie
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notif) => (
                    <NotificationItem
                      key={notif.id}
                      notification={notif}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Préférences de notification (lien rapide) */}
      <div className="text-right">
        <Button variant="link" asChild>
          <Link href="/settings?tab=notifications">
            Gérer vos préférences de notification
          </Link>
        </Button>
      </div>
    </div>
  );
}
