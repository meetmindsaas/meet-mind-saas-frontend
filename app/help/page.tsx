// app/help/page.tsx
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  HelpCircle,
  MessageSquare,
  FileText,
  Video,
  BookOpen,
  Mail,
  MessageCircle,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import Link from "next/link";

// FAQ data
const faqs = [
  {
    question: "Comment importer une réunion depuis Zoom ?",
    answer:
      "Connectez votre compte Zoom dans les intégrations, puis utilisez l'import par lien ou synchronisation automatique.",
    category: "import",
  },
  {
    question: "L'IA peut-elle détecter plusieurs locuteurs ?",
    answer:
      "Oui, l'IA identifie automatiquement les différents participants et segmente la transcription par locuteur.",
    category: "transcription",
  },
  {
    question: "Comment fonctionne le système de crédits ?",
    answer:
      "1 crédit = 1 minute de transcription audio. Les générations de compte rendu utilisent également des crédits.",
    category: "billing",
  },
  {
    question: "Puis-je personnaliser le prompt IA ?",
    answer:
      "Oui, dans Paramètres > IA, vous pouvez définir un prompt système personnalisé.",
    category: "ai",
  },
  {
    question: "Les données sont-elles sécurisées ?",
    answer:
      "Toutes les données sont chiffrées au repos et en transit. Nous sommes conformes RGPD.",
    category: "security",
  },
  {
    question: "Comment exporter un compte rendu ?",
    answer:
      "Sur la page du compte rendu, cliquez sur 'Export' et choisissez le format (PDF, DOCX, Markdown).",
    category: "export",
  },
];

const guides = [
  { title: "Premiers pas avec MeetMind", duration: "5 min", icon: BookOpen },
  { title: "Guide d'import des réunions", duration: "10 min", icon: Video },
  {
    title: "Optimisation des comptes rendus",
    duration: "15 min",
    icon: FileText,
  },
  { title: "Collaboration en équipe", duration: "8 min", icon: Users },
];

const resources = [
  { name: "Documentation API", icon: FileText, link: "/docs/api" },
  {
    name: "Support technique",
    icon: MessageCircle,
    link: "mailto:support@meetmind.com",
  },
  { name: "Communauté", icon: Users, link: "/community" },
  { name: "Status", icon: Activity, link: "/status" },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [helpful, setHelpful] = useState<{ [key: number]: boolean | null }>({});

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleFeedback = (index: number, isHelpful: boolean) => {
    setHelpful({ ...helpful, [index]: isHelpful });
    toast({
      title: "Merci pour votre retour !",
      description: "Votre avis nous aide à nous améliorer",
      variant: "success",
    });
  };

  const handleContactSupport = () => {
    toast({
      title: "Support contacté",
      description: "Notre équipe vous répondra sous 24h",
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Comment pouvons-nous vous aider ?
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Retrouvez toutes les réponses à vos questions, guides et documentation
        </p>

        {/* Barre de recherche */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une réponse..."
            className="pl-9 h-12 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all"
          onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
        >
          <CardContent className="pt-6 text-center">
            <HelpCircle className="h-8 w-8 mx-auto mb-3 text-primary" />
            <p className="font-medium">FAQ</p>
            <p className="text-xs text-muted-foreground">
              Questions fréquentes
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="pt-6 text-center">
            <Video className="h-8 w-8 mx-auto mb-3 text-primary" />
            <p className="font-medium">Tutoriels vidéo</p>
            <p className="text-xs text-muted-foreground">
              Formations pas à pas
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-lg transition-all"
          onClick={handleContactSupport}
        >
          <CardContent className="pt-6 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-3 text-primary" />
            <p className="font-medium">Support</p>
            <p className="text-xs text-muted-foreground">Contactez-nous</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-3 text-primary" />
            <p className="font-medium">Documentation</p>
            <p className="text-xs text-muted-foreground">API et intégrations</p>
          </CardContent>
        </Card>
      </div>

      {/* Guides rapides */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Guides rapides</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {guides.map((guide, i) => (
            <Card
              key={i}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <guide.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{guide.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {guide.duration}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Questions fréquentes</h2>
          <Badge variant="secondary">{filteredFaqs.length} articles</Badge>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="ai">IA</TabsTrigger>
            <TabsTrigger value="billing">Facturation</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">{faq.answer}</p>
                      <div className="flex items-center gap-4 pt-2">
                        <span className="text-xs text-muted-foreground">
                          Cet article vous a-t-il été utile ?
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFeedback(index, true)}
                            className={
                              helpful[index] === true ? "text-green-500" : ""
                            }
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFeedback(index, false)}
                            className={
                              helpful[index] === false ? "text-red-500" : ""
                            }
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          {["import", "transcription", "ai", "billing"].map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs
                  .filter((faq) => faq.category === category)
                  .map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Ressources */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Ressources</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {resources.map((resource, i) => (
            <Link key={i} href={resource.link}>
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="pt-6 text-center">
                  <resource.icon className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium text-sm">{resource.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Contact support */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-none">
        <CardContent className="pt-6 text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">
            Vous n&apos;avez pas trouvé votre réponse ?
          </h3>
          <p className="text-muted-foreground mb-6">
            Notre équipe de support est disponible pour vous aider
          </p>
          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <Button onClick={handleContactSupport}>
              <Mail className="h-4 w-4 mr-2" />
              Contacter le support
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat en direct
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="border-t pt-6 mt-6">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between items-center text-sm text-muted-foreground">
          <div className="flex gap-6">
            <Link href="/help/terms">Conditions d&apos;utilisation</Link>
            <Link href="/help/privacy">Politique de confidentialité</Link>
            <Link href="/help/cookies">Cookies</Link>
          </div>
          {/* <div className="flex gap-4">
            <Link href="https://twitter.com/meetmind" target="_blank">
              <Twitter className="h-4 w-4" />
            </Link>
            <Link href="https://youtube.com/meetmind" target="_blank">
              <Youtube className="h-4 w-4" />
            </Link>
            <Link href="https://github.com/meetmind" target="_blank">
              <Github className="h-4 w-4" />
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}

// Import manquant
import { Users, Activity } from "lucide-react";
