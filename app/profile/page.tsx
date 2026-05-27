// app/profile/page.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Briefcase,
  MapPin,
  Calendar,
  Camera,
  Save,
  CreditCard,
  Shield,
  Bell,
  Globe,
  Building2,
  Users,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";

export default function ProfilePage() {
  const user = useUser(); // ← récupération des données de contexte
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean@meetmind.com",
    jobTitle: "Chef de produit",
    company: "MeetMind",
    location: "Paris, France",
    bio: "Passionné par l'IA et l'innovation produit. En charge de la roadmap produit.",
    phone: "+33 6 12 34 56 78",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées",
        variant: "success",
      });
    }, 1000);
  };

  const stats = {
    meetings: 47,
    actions: 128,
    accuracy: 94,
    hoursSaved: 32,
  };

  // Helper pour afficher le libellé du rôle
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "owner":
        return "Propriétaire";
      case "admin":
        return "Administrateur";
      default:
        return "Membre";
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mon profil</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos informations personnelles et préférences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar gauche - Infos clés */}
        <div className="lg:col-span-1 space-y-6">
          {/* Carte avatar */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/avatars/user.jpg" alt="Avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="mt-3">
                  <Camera className="h-3 w-3 mr-2" />
                  Changer la photo
                </Button>
                <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {formData.jobTitle}
                </p>
                <Badge variant="secondary" className="mt-2">
                  Membre depuis janvier 2024
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Carte Organisation / Contexte */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Mon contexte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-muted-foreground">
                  Organisation
                </span>
                <span className="font-medium">{user.organization.name}</span>
              </div>
              {user.department && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-muted-foreground">
                    Département
                  </span>
                  <span className="font-medium">{user.department.name}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-muted-foreground">Rôle</span>
                <Badge variant="outline" className="capitalize">
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
              {user.isDepartmentManager && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-muted-foreground">Manager</span>
                  <BadgeCheck className="h-4 w-4 text-blue-500" />
                </div>
              )}
              {user.organization.industry && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-muted-foreground">Secteur</span>
                  <span className="text-sm capitalize">
                    {user.organization.industry}
                  </span>
                </div>
              )}
              {user.organization.teamSize && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Taille équipe
                  </span>
                  <span className="text-sm">
                    {user.organization.teamSize} personnes
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistiques (inchangé) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Réunions traitées
                </span>
                <span className="font-semibold">{stats.meetings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Actions complétées
                </span>
                <span className="font-semibold">{stats.actions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Précision IA
                </span>
                <span className="font-semibold">{stats.accuracy}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Heures économisées
                </span>
                <span className="font-semibold">{stats.hoursSaved}h</span>
              </div>
            </CardContent>
          </Card>

          {/* Navigation rapide (inchangée) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Accès rapide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/subscription"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Abonnement</span>
              </Link>
              <Link
                href="/security"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Sécurité</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Notifications</span>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Formulaire principal (inchangé) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Poste</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Entreprise</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Courte présentation (max 200 caractères)
                  </p>
                </div>
              </CardContent>
              <CardContent className="border-t pt-6">
                <div className="flex justify-end gap-3">
                  <Button variant="outline" type="button">
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>Enregistrement...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
