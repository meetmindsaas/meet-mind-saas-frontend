// components/AuthInput.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";

// components/AuthInput.tsx
interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, helperText, ...props }, ref) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input ref={ref} {...props} />
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  ),
);
AuthInput.displayName = "AuthInput";
