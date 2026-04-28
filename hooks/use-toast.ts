// app/hooks/use-toast.ts
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
};

export function toast({
  title,
  description,
  variant = "default",
  duration = 3000,
}: ToastProps) {
  const options = {
    duration,
    description,
  };

  switch (variant) {
    case "destructive":
      return sonnerToast.error(title, options);
    case "success":
      return sonnerToast.success(title, options);
    default:
      return sonnerToast(title, options);
  }
}

// Export aussi la fonction original sonner pour plus de flexibilité
export { sonnerToast };
