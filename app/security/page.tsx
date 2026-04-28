// app/security/page.tsx
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Shield,
  Lock,
  Smartphone,
  Mail,
  History,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SecurityPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const sessions = [
    {
      id: 1,
      device: "Chrome sur Windows",
      location: "Paris, France",
      ip: "192.168.1.1",
      lastActive: "Maintenant",
      current: true,
    },
    {
      id: 2,
      device: "Safari sur iPhone",
      location: "Paris, France",
      ip: "192.168.1.2",
      lastActive: "Il y a 2 heures",
      current: false,
    },
    {
      id: 3,
      device: "Firefox sur Mac",
      location: "Lyon, France",
      ip: "192.168.1.3",
      lastActive: "Hier",
      current: false,
    },
  ];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour",
        variant: "success",
      });
    }, 1000);
  };

  const handleRevokeSession = (sessionId: number) => {
    toast({
      title: "Session révoquée",
      description: "L'appareil a été déconnecté",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export demandé",
      description: "Un email avec vos données vous sera envoyé sous 48h",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Compte supprimé",
      description: "Votre compte a été supprimé",
      variant: "destructive",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sécurité</h1>
        <p className="text-muted-foreground mt-1">
          Gérez la sécurité de votre compte et vos sessions
        </p>
      </div>

      {/* Niveau de sécurité */}
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <CardTitle>Niveau de sécurité : Élevé</CardTitle>
            </div>
            <Badge className="bg-green-500">Sécurisé</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Authentification à deux facteurs activée</span>
          </div>
        </CardContent>
      </Card>

      {/* Changement mot de passe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Mot de passe
          </CardTitle>
          <CardDescription>
            Modifiez votre mot de passe régulièrement pour plus de sécurité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="ml-2 text-xs">
                  {showPassword ? "Masquer" : "Afficher"}
                </span>
              </Button>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Modification..." : "Changer le mot de passe"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Authentification à deux facteurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Authentification à deux facteurs (2FA)
          </CardTitle>
          <CardDescription>
            Renforcez la sécurité de votre compte avec une double
            authentification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Authentification à deux facteurs</p>
              <p className="text-sm text-muted-foreground">
                Recevez un code sur votre téléphone à chaque connexion
              </p>
            </div>
            <Switch checked={mfaEnabled} onCheckedChange={setMfaEnabled} />
          </div>
          {mfaEnabled && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium mb-2">Configurer 2FA</p>
              <p className="text-xs text-muted-foreground mb-3">
                Scannez ce QR code avec Google Authenticator ou une application
                compatible
              </p>
              <div className="flex justify-center">
                <div className="h-32 w-32 bg-black rounded-lg flex items-center justify-center text-white text-xs">
                  [QR CODE]
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Vérifier le code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sessions actives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Sessions actives
          </CardTitle>
          <CardDescription>Appareils connectés à votre compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{session.device}</p>
                  {session.current && (
                    <Badge variant="secondary" className="text-xs">
                      Appareil actuel
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {session.location} • {session.ip}
                </p>
                <p className="text-xs text-muted-foreground">
                  Dernière activité : {session.lastActive}
                </p>
              </div>
              {!session.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRevokeSession(session.id)}
                >
                  Révoquer
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" className="w-full">
            Déconnecter tous les appareils
          </Button>
        </CardContent>
      </Card>

      {/* Notifications de sécurité */}
      <Card>
        <CardHeader>
          <CardTitle>Alertes de sécurité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Nouvelles connexions</p>
              <p className="text-sm text-muted-foreground">
                Recevoir un email lors d&apos;une nouvelle connexion
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Modification du mot de passe</p>
              <p className="text-sm text-muted-foreground">
                Notifier lors d&apos;un changement de mot de passe
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Export / Suppression */}
      <Separator />
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Données et confidentialité</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Exporter mes données</CardTitle>
              <CardDescription>
                Recevez une archive de toutes vos données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={handleExportData}>
                <Mail className="h-4 w-4 mr-2" />
                Demander l&apos;export
              </Button>
            </CardContent>
          </Card>
          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500">
                Supprimer mon compte
              </CardTitle>
              <CardDescription>
                Action irréversible - toutes vos données seront supprimées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="text-red-500 border-red-500"
                onClick={handleDeleteAccount}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Supprimer mon compte
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
