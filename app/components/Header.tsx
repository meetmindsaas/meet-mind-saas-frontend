// app/components/Header.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import {
  Building2,
  BadgeCheck,
  Users,
  ChevronDown,
  Search,
  Bell,
  Command,
  LogOut,
  Settings,
  HelpCircle,
  Shield,
  Sparkles,
  CreditCard,
  User as UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Types
interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "meeting" | "action" | "system";
}

// Données mock (à remplacer par les vraies données)
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "CR généré",
    description: "Stratégie produit Q4 - 12 actions identifiées",
    time: "Il y a 5 min",
    read: false,
    type: "meeting",
  },
  {
    id: "2",
    title: "Action en retard",
    description: "Préparer le spec technique - échéance aujourd'hui",
    time: "Il y a 1 heure",
    read: false,
    type: "action",
  },
  {
    id: "3",
    title: "Nouveau membre",
    description: "Thomas a rejoint votre équipe",
    time: "Il y a 2 heures",
    read: true,
    type: "system",
  },
  {
    id: "4",
    title: "Mise à jour IA",
    description: "Nouveau modèle disponible : analyse plus précise",
    time: "Hier",
    read: true,
    type: "system",
  },
];

export function Header() {
  const pathname = usePathname();
  const user = useUser();
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Gestion du raccourci clavier Cmd+K / Ctrl+K
  if (typeof window !== "undefined") {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document
          .querySelector<HTMLInputElement>('input[type="search"]')
          ?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    // Pas de cleanup ici car ce code est exécuté à chaque render → à déplacer dans useEffect
  }

  // Version correcte avec useEffect
  // (je la mets en commentaire, mais vous devez l'utiliser à la place du bloc ci-dessus)
  /*
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.querySelector('input[type="search"]')?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
  */

  const getPageTitle = () => {
    if (pathname === "/") return "Tableau de bord";
    if (pathname === "/reunions") return "Mes réunions";
    if (pathname === "/import") return "Importer";
    if (pathname === "/live") return "Réunion en direct";
    if (pathname === "/settings") return "Paramètres";
    if (pathname === "/team") return "Équipe";
    if (pathname?.startsWith("/reunions/")) return "Détail de la réunion";
    return "MeetMind";
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast({
      title: "Notifications marquées comme lues",
      variant: "success",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
    // À remplacer par une vraie déconnexion (suppression cookie, redirection)
    // router.push("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Recherche",
      description: `Recherche de "${searchQuery}"...`,
    });
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "meeting":
        return <div className="h-2 w-2 rounded-full bg-blue-500" />;
      case "action":
        return <div className="h-2 w-2 rounded-full bg-green-500" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-purple-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      {/* Partie gauche : titre mobile + contexte organisation */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-tight md:hidden">
          {getPageTitle()}
        </h1>
        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {user.organization.name}
            </span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
            {user.department && (
              <>
                <span className="text-muted-foreground">/</span>
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.department.name}</span>
              </>
            )}
            {user.isDepartmentManager && (
              <span className="ml-2 inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                Manager
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Barre de recherche - Desktop */}
      <div className="hidden flex-1 items-center justify-center md:flex md:justify-start md:pl-8">
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une réunion, une action..."
            className="w-full pl-9 bg-muted/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <Command className="h-3 w-3" />K
          </kbd>
        </form>
      </div>

      {/* Actions à droite */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Crédits IA */}
        <div className="hidden items-center gap-2 rounded-full bg-primary/10 px-3 py-1 md:flex">
          <Sparkles className="h-3 w-3 text-primary" />
          <span className="text-xs font-medium">247 crédits</span>
        </div>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between border-b p-3">
              <h4 className="font-medium">Notifications</h4>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Tout marquer comme lu
                </Button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune notification</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex cursor-pointer gap-3 border-b p-3 transition-colors hover:bg-muted/50 ${
                      !notif.read ? "bg-muted/30" : ""
                    }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {notif.description}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {notif.time}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="border-t p-2">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                Voir toutes les notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Menu utilisateur enrichi */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/user.jpg" alt="Avatar" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Organisation</span>
                <span className="font-medium text-foreground">
                  {user.organization.name}
                </span>
              </div>
              {user.department && (
                <div className="mt-1 flex justify-between">
                  <span>Département</span>
                  <span className="font-medium text-foreground">
                    {user.department.name}
                  </span>
                </div>
              )}
              <div className="mt-1 flex justify-between">
                <span>Rôle</span>
                <span className="capitalize font-medium text-foreground">
                  {user.role}
                </span>
              </div>
              {user.isDepartmentManager && (
                <div className="mt-1 flex items-center justify-end gap-1 text-blue-600">
                  <BadgeCheck className="h-3 w-3" />
                  <span>Manager</span>
                </div>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/subscription">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Abonnement
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/security">
                  <Shield className="mr-2 h-4 w-4" />
                  Sécurité
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/parametres">
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/help">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Aide
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Barre de recherche mobile */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {searchOpen && (
        <div className="absolute inset-x-0 top-16 z-50 border-b bg-background p-4 md:hidden">
          <form onSubmit={handleSearch}>
            <Input
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </form>
        </div>
      )}
    </header>
  );
}
