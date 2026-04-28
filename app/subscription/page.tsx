// app/subscription/page.tsx
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  Crown,
  Sparkles,
  CheckCircle2,
  XCircle,
  Zap,
  Users,
  FileText,
  Clock,
  CreditCard,
  Download,
  Calendar,
  Infinity,
} from "lucide-react";
import Link from "next/link";

// Plans tarifaires
const plans = [
  {
    id: "free",
    name: "Gratuit",
    price: 0,
    period: "mois",
    description: "Pour commencer avec l'IA",
    features: [
      "3 réunions par mois",
      "Transcription basique",
      "CR standard",
      "Export PDF",
      "Support email",
    ],
    notIncluded: [
      "Import par lien",
      "Mode live",
      "Collaboration équipe",
      "API accès",
    ],
    icon: Users,
    color: "gray",
  },
  {
    id: "pro",
    name: "Professionnel",
    price: 29,
    period: "mois",
    description: "Pour les équipes productives",
    features: [
      "Réunions illimitées",
      "Import Zoom/Meet/Teams",
      "Mode live transcription",
      "Collaboration équipe (5 membres)",
      "Templates personnalisés",
      "Export PDF/DOCX/Markdown",
      "Support prioritaire",
      "API accès basique",
    ],
    notIncluded: [],
    icon: Sparkles,
    color: "blue",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    period: "mois",
    description: "Pour les grandes organisations",
    features: [
      "Tout du plan Pro",
      "Membres illimités",
      "Marque blanche",
      "SSO & MFA",
      "SLA dédié",
      "Audit logs",
      "API complète",
      "Support 24/7",
      "Formation équipe",
    ],
    notIncluded: [],
    icon: Crown,
    color: "purple",
  },
];

// Historique des factures (mock)
const invoices = [
  { id: "INV-001", date: "15/01/2024", amount: 29, status: "paid" },
  { id: "INV-002", date: "15/02/2024", amount: 29, status: "paid" },
  { id: "INV-003", date: "15/03/2024", amount: 29, status: "paid" },
];

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState("pro");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = (planId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPlan(planId);
      toast({
        title: "Abonnement mis à jour",
        description: `Vous êtes maintenant sur le plan ${plans.find((p) => p.id === planId)?.name}`,
        variant: "success",
      });
    }, 1500);
  };

  const usage = {
    meetingsUsed: 24,
    meetingsLimit: currentPlan === "free" ? 3 : 999999,
    membersUsed: 3,
    membersLimit: currentPlan === "pro" ? 5 : 999999,
    storageUsed: 2.4,
    storageLimit: currentPlan === "free" ? 1 : currentPlan === "pro" ? 50 : 500,
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Abonnement</h1>
        <p className="text-muted-foreground mt-1">
          Gérez votre forfait et vos options de paiement
        </p>
      </div>

      {/* Plan actuel */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <CardTitle>Plan actuel : Professionnel</CardTitle>
            </div>
            <Badge className="bg-green-500">Actif</Badge>
          </div>
          <CardDescription>
            Renouvellement automatique le 15/04/2024 - 29€/mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Réunions utilisées</span>
                <span className="inline-flex items-center gap-1">
                  {usage.meetingsUsed} /{" "}
                  {usage.meetingsLimit === 999999 ? (
                    <Infinity className="w-3 h-3" />
                  ) : (
                    usage.meetingsLimit
                  )}
                </span>
              </div>
              <Progress
                value={(usage.meetingsUsed / 100) * 100}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Membres utilisés</span>
                <span className="inline-flex items-center gap-1">
                  {usage.membersUsed} /{" "}
                  {usage.membersLimit === 999999 ? (
                    <Infinity className="w-3 h-3" />
                  ) : (
                    usage.membersLimit
                  )}
                </span>
              </div>
              <Progress
                value={(usage.membersUsed / usage.membersLimit) * 100}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Stockage utilisé</span>
                <span>
                  {usage.storageUsed} GB / {usage.storageLimit} GB
                </span>
              </div>
              <Progress
                value={(usage.storageUsed / usage.storageLimit) * 100}
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Méthode de paiement */}
      <Card>
        <CardHeader>
          <CardTitle>Méthode de paiement</CardTitle>
          <CardDescription>
            Gérez vos informations de facturation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">Visa •••• 4242</p>
                <p className="text-sm text-muted-foreground">
                  Expire le 12/2026
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Modifier
            </Button>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-muted-foreground">
              Prochain paiement
            </span>
            <span className="font-medium">29€ le 15 avril 2024</span>
          </div>
        </CardContent>
      </Card>

      {/* Plans tarifaires */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Changer de formule</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-visible pt-4 ${
                plan.popular ? "border-primary shadow-lg" : ""
              } ${currentPlan === plan.id ? "ring-2 ring-primary" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-primary px-3 py-1">
                  Populaire
                </Badge>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <plan.icon
                    className={`h-8 w-8 ${
                      plan.color === "blue"
                        ? "text-blue-500"
                        : plan.color === "purple"
                          ? "text-purple-500"
                          : "text-muted-foreground"
                    }`}
                  />
                  {currentPlan === plan.id && (
                    <Badge variant="secondary">Actuel</Badge>
                  )}
                </div>
                <CardTitle className="mt-4">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}€</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {feature}
                    </div>
                  ))}
                  {plan.notIncluded?.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <XCircle className="h-4 w-4" />
                      {feature}
                    </div>
                  ))}
                </div>
                {currentPlan !== plan.id && (
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isLoading}
                  >
                    {plan.price === 0
                      ? "Commencer gratuit"
                      : "Passer à ce plan"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Crédits IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            Crédits IA
          </CardTitle>
          <CardDescription>
            Utilisés pour les transcriptions et générations avancées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">247</p>
              <p className="text-sm text-muted-foreground">crédits restants</p>
            </div>
            <Button variant="outline">Acheter des crédits</Button>
          </div>
          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            Un crédit = 1 minute de transcription ou 1 génération de CR
          </p>
        </CardContent>
      </Card>

      {/* Historique des factures */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des factures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{invoice.amount}€</span>
                  <Badge variant="secondary">Payée</Badge>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Annulation */}
      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-500">Annuler mon abonnement</CardTitle>
          <CardDescription>
            Vous pourrez toujours réactiver votre abonnement plus tard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="text-red-500 border-red-500 hover:bg-red-500/10"
          >
            Annuler l&apos;abonnement
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
