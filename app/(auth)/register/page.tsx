// app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthCard } from "@/app/components/AuthCard";
import { AuthInput } from "@/app/components/AuthInput";
import { SocialButton } from "@/app/components/SocialButton";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Étape 1 : informations personnelles
const personalInfoSchema = z
  .object({
    name: z.string().min(2, "Nom complet requis"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "8 caractères minimum"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type PersonalInfo = z.infer<typeof personalInfoSchema>;

// Étape 2 : organisation
const teamSizes = ["1-5", "6-10", "11-25", "26-50", "51-200", "200+"] as const;
type TeamSize = (typeof teamSizes)[number];

const organizationSchema = z.object({
  organizationName: z.string().min(2, "Nom de l'organisation requis"),
  organizationSlug: z
    .string()
    .min(2, "Identifiant unique requis")
    .regex(/^[a-z0-9-]+$/, "Uniquement lettres minuscules, chiffres et tirets"),
  industry: z.string().optional(),
  teamSize: z.enum(teamSizes).optional(),
});

type OrganizationInfo = z.infer<typeof organizationSchema>;

// Données complètes
type RegisterData = PersonalInfo & OrganizationInfo;

function isValidTeamSize(value: string): value is TeamSize {
  return teamSizes.includes(value as TeamSize);
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // État pour stocker les données temporairement
  const [personalData, setPersonalData] = useState<PersonalInfo | null>(null);
  const [orgData, setOrgData] = useState<OrganizationInfo>({
    organizationName: "",
    organizationSlug: "",
    industry: "",
    teamSize: undefined,
  });

  // Formulaires individuels
  const personalForm = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalData || {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const orgForm = useForm<OrganizationInfo>({
    resolver: zodResolver(organizationSchema),
    defaultValues: orgData,
  });

  const onPersonalSubmit = (data: PersonalInfo) => {
    setPersonalData(data);
    setStep(2);
  };

  const onOrgSubmit = (data: OrganizationInfo) => {
    setOrgData(data);
    setStep(3);
  };

  const onFinalSubmit = async () => {
    if (!personalData) return;
    const fullData: RegisterData = { ...personalData, ...orgData };
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullData.name,
          email: fullData.email,
          password: fullData.password,
          organization: {
            name: fullData.organizationName,
            slug: fullData.organizationSlug,
            industry: fullData.industry,
            teamSize: fullData.teamSize,
          },
        }),
      });
      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Erreur lors de l'inscription");

      toast({
        title: "Compte créé !",
        description:
          "Votre organisation a été créée. Vous pouvez maintenant vous connecter.",
        variant: "success",
      });
      router.push("/login");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
            <span className="text-2xl font-bold">MeetMind</span>
          </div>
          <p className="text-muted-foreground mt-2">
            Créez votre espace de travail en quelques étapes
          </p>
        </div>

        <AuthCard
          title="Inscription"
          description="Remplissez les informations ci-dessous"
        >
          {/* Barre de progression */}
          <div className="mb-6 space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              Étape {step} sur 3
            </p>
          </div>

          {/* Étape 1 : Informations personnelles */}
          {step === 1 && (
            <form
              onSubmit={personalForm.handleSubmit(onPersonalSubmit)}
              className="space-y-4"
            >
              <AuthInput
                label="Nom complet"
                placeholder="Jean Dupont"
                error={personalForm.formState.errors.name?.message}
                {...personalForm.register("name")}
              />
              <AuthInput
                label="Email"
                type="email"
                placeholder="jean@exemple.com"
                error={personalForm.formState.errors.email?.message}
                {...personalForm.register("email")}
              />
              <div className="relative">
                <AuthInput
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  error={personalForm.formState.errors.password?.message}
                  {...personalForm.register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <AuthInput
                label="Confirmer le mot de passe"
                type="password"
                placeholder="••••••••"
                error={personalForm.formState.errors.confirmPassword?.message}
                {...personalForm.register("confirmPassword")}
              />
              <Button type="submit" className="w-full">
                Étape suivante
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          {/* Étape 2 : Organisation */}
          {step === 2 && (
            <form
              onSubmit={orgForm.handleSubmit(onOrgSubmit)}
              className="space-y-4"
            >
              <AuthInput
                label="Nom de l'organisation"
                placeholder="Acme Inc."
                error={orgForm.formState.errors.organizationName?.message}
                {...orgForm.register("organizationName")}
              />
              <AuthInput
                label="Identifiant unique (URL)"
                placeholder="acme"
                error={orgForm.formState.errors.organizationSlug?.message}
                {...orgForm.register("organizationSlug")}
                helperText="Utilisé pour votre URL personnalisée : acme.meetmind.com"
              />
              <Select
                onValueChange={(val) => orgForm.setValue("industry", val)}
                defaultValue={orgData.industry}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Secteur d'activité (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technologie</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="sante">Santé</SelectItem>
                  <SelectItem value="education">Éducation</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <Select
                onValueChange={(val) => {
                  if (isValidTeamSize(val)) orgForm.setValue("teamSize", val);
                }}
                defaultValue={orgData.teamSize}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Taille de l'équipe (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  {teamSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size} personnes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                <Button type="submit" className="flex-1">
                  Étape suivante
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Étape 3 : Récapitulatif et confirmation */}
          {step === 3 && personalData && (
            <div className="space-y-6">
              <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                <h3 className="font-medium">Récapitulatif</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nom complet :</span>
                    <span>{personalData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email :</span>
                    <span>{personalData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Organisation :
                    </span>
                    <span>{orgData.organizationName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Identifiant URL :
                    </span>
                    <span>{orgData.organizationSlug}</span>
                  </div>
                  {orgData.industry && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Secteur :</span>
                      <span>{orgData.industry}</span>
                    </div>
                  )}
                  {orgData.teamSize && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Taille équipe :
                      </span>
                      <span>{orgData.teamSize} personnes</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                <Button
                  onClick={onFinalSubmit}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Créer mon compte
                </Button>
              </div>
            </div>
          )}
        </AuthCard>

        {/* Options sociales (uniquement sur la première étape) */}
        {step === 1 && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou s&apos;inscrire avec
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <SocialButton provider="google" onClick={() => {}} />
              <SocialButton provider="github" onClick={() => {}} />
              <SocialButton provider="microsoft" onClick={() => {}} />
            </div>
          </>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
