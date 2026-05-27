// contexts/UserContext.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";

// Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  industry?: string;
  teamSize?: string;
}

export interface Department {
  id: string;
  name: string;
  managerId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "admin" | "member";
  department?: Department;
  isDepartmentManager: boolean;
  organization: Organization;
}

// Valeur par défaut (mock)
const defaultUser: User = {
  id: "1",
  name: "Jean Dupont",
  email: "jean@meetmind.com",
  role: "admin",
  department: {
    id: "dept1",
    name: "Produit",
    managerId: "1", // correspond à son id → il est manager
  },
  isDepartmentManager: true,
  organization: {
    id: "org1",
    name: "MeetMind",
    slug: "meetmind",
    industry: "tech",
    teamSize: "6-10",
  },
};

const UserContext = createContext<User>(defaultUser);

export function UserProvider({ children }: { children: ReactNode }) {
  // Ici, plus tard, on remplacera par un appel API ou une lecture de session
  // Pour l'instant, on renvoie les données statiques
  return (
    <UserContext.Provider value={defaultUser}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
