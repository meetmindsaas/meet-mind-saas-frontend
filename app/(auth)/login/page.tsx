// app/(auth)/login/page.tsx
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
import { Eye, EyeOff, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Appel API d'authentification
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Erreur de connexion");

      toast({ title: "Connexion réussie", variant: "success" });
      router.push("/"); // Redirection vers tableau de bord
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue";
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Authentification sociale",
      description: `${provider} - À implémenter`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
            <span className="text-2xl font-bold">MeetMind</span>
          </div>
          <p className="text-muted-foreground mt-2">
            Centralisez et automatisez vos comptes rendus
          </p>
        </div>

        <AuthCard
          title="Connexion"
          description="Entrez vos identifiants pour accéder à votre espace"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AuthInput
              label="Email"
              type="email"
              placeholder="jean@exemple.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <div className="relative">
              <AuthInput
                label="Mot de passe"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
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
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Se connecter
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continuer avec
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <SocialButton
              provider="google"
              onClick={() => handleSocialLogin("google")}
            />
            <SocialButton
              provider="github"
              onClick={() => handleSocialLogin("github")}
            />
            <SocialButton
              provider="microsoft"
              onClick={() => handleSocialLogin("microsoft")}
            />
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="text-primary font-medium hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}
