// app/team/page.tsx
"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  UserPlus,
  Mail,
  Crown,
  MoreVertical,
  Trash2,
  Shield,
  Clock,
  Activity,
  FileText,
  CheckCircle2,
  Send,
  X,
  Plus,
  Edit2,
  Building2,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Types
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  avatar?: string;
  status: "active" | "invited" | "inactive";
  joinedAt: string;
  meetingsCount: number;
  actionsCompleted: number;
}

interface Invitation {
  id: string;
  email: string;
  role: "admin" | "member";
  invitedAt: string;
  expiresAt: string;
}

interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  memberCount: number;
  createdAt: string;
}

interface DepartmentMember {
  userId: string;
  departmentId: string;
  role?: "manager" | "member";
}

// Données mock
const mockMembers: TeamMember[] = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean@meetmind.com",
    role: "owner",
    status: "active",
    joinedAt: "2024-01-01",
    meetingsCount: 47,
    actionsCompleted: 128,
  },
  {
    id: "2",
    name: "Sophie Martin",
    email: "sophie@meetmind.com",
    role: "admin",
    status: "active",
    joinedAt: "2024-01-05",
    meetingsCount: 32,
    actionsCompleted: 87,
  },
  {
    id: "3",
    name: "Thomas Bernard",
    email: "thomas@meetmind.com",
    role: "member",
    status: "active",
    joinedAt: "2024-01-10",
    meetingsCount: 28,
    actionsCompleted: 64,
  },
  {
    id: "4",
    name: "Julie Petit",
    email: "julie@meetmind.com",
    role: "member",
    status: "invited",
    joinedAt: "",
    meetingsCount: 0,
    actionsCompleted: 0,
  },
];

const mockInvitations: Invitation[] = [
  {
    id: "1",
    email: "lucas@email.com",
    role: "member",
    invitedAt: "2024-01-14",
    expiresAt: "2024-01-21",
  },
  {
    id: "2",
    email: "marie@email.com",
    role: "admin",
    invitedAt: "2024-01-13",
    expiresAt: "2024-01-20",
  },
];

const mockDepartments: Department[] = [
  {
    id: "dept1",
    name: "Produit",
    description: "Gestion de la feuille de route produit",
    managerId: "1",
    memberCount: 1,
    createdAt: "2024-01-01",
  },
  {
    id: "dept2",
    name: "Design",
    description: "Expérience utilisateur et interfaces",
    managerId: "2",
    memberCount: 1,
    createdAt: "2024-01-05",
  },
  {
    id: "dept3",
    name: "Développement",
    description: "Équipe technique",
    managerId: "3",
    memberCount: 2,
    createdAt: "2024-01-10",
  },
];

const mockDepartmentMembers: DepartmentMember[] = [
  { userId: "1", departmentId: "dept1", role: "manager" },
  { userId: "2", departmentId: "dept2", role: "manager" },
  { userId: "3", departmentId: "dept3", role: "manager" },
  { userId: "4", departmentId: "dept3", role: "member" },
];

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(mockMembers);
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [departmentMembers, setDepartmentMembers] = useState<
    DepartmentMember[]
  >(mockDepartmentMembers);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isDeptDialogOpen, setIsDeptDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptDesc, setNewDeptDesc] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // Exemple d'appel API pour sauvegarder toute la configuration
      // const response = await fetch('/api/team/save', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ members, invitations, departments, departmentMembers }),
      // });
      // if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

      // Simulation d'un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Configuration sauvegardée",
        description: "Toutes les modifications ont été enregistrées.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetDepartmentManager = (
    deptId: string,
    managerId: string | undefined,
  ) => {
    setDepartments((prev) =>
      prev.map((dept) => (dept.id === deptId ? { ...dept, managerId } : dept)),
    );
    toast({
      title: "Responsable mis à jour",
      description: managerId
        ? "Le responsable a été désigné"
        : "Le responsable a été retiré",
      variant: "success",
    });
  };

  // Mettre à jour les compteurs de départements
  useEffect(() => {
    const counts = departmentMembers.reduce(
      (acc, dm) => {
        acc[dm.departmentId] = (acc[dm.departmentId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDepartments((prev) =>
      prev.map((d) => ({ ...d, memberCount: counts[d.id] || 0 })),
    );
  }, [departmentMembers]);

  const getRoleIcon = (role: TeamMember["role"]) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "admin":
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <Users className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleLabel = (role: TeamMember["role"]) => {
    switch (role) {
      case "owner":
        return "Propriétaire";
      case "admin":
        return "Administrateur";
      default:
        return "Membre";
    }
  };

  const getStatusBadge = (status: TeamMember["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Actif</Badge>;
      case "invited":
        return <Badge variant="secondary">Invitation envoyée</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inactif</Badge>;
    }
  };

  const handleInvite = () => {
    if (!inviteEmail) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer une adresse email",
        variant: "destructive",
      });
      return;
    }
    const newInvitation: Invitation = {
      id: Date.now().toString(),
      email: inviteEmail,
      role: inviteRole,
      invitedAt: new Date().toISOString().split("T")[0],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };
    setInvitations([newInvitation, ...invitations]);
    setIsInviteDialogOpen(false);
    setInviteEmail("");
    toast({
      title: "Invitation envoyée !",
      description: `Une invitation a été envoyée à ${inviteEmail}`,
      variant: "success",
    });
  };

  const handleResendInvitation = (email: string) => {
    toast({
      title: "Invitation renvoyée",
      description: `Une nouvelle invitation a été envoyée à ${email}`,
      variant: "success",
    });
  };

  const handleCancelInvitation = (id: string) => {
    setInvitations(invitations.filter((inv) => inv.id !== id));
    toast({ title: "Invitation annulée" });
  };

  const handleRemoveMember = (id: string, name: string) => {
    // Supprimer aussi l'affectation départementale
    setDepartmentMembers(departmentMembers.filter((dm) => dm.userId !== id));
    setMembers(members.filter((m) => m.id !== id));
    toast({
      title: "Membre retiré",
      description: `${name} a été retiré de l'équipe`,
    });
  };

  const handleChangeRole = (id: string, newRole: "admin" | "member") => {
    setMembers(members.map((m) => (m.id === id ? { ...m, role: newRole } : m)));
    toast({
      title: "Rôle modifié",
      description: `Le rôle a été mis à jour avec succès`,
      variant: "success",
    });
  };

  // Gestion des départements
  const handleAddDepartment = () => {
    if (!newDeptName.trim()) {
      toast({ title: "Nom requis", variant: "destructive" });
      return;
    }
    const newDept: Department = {
      id: Date.now().toString(),
      name: newDeptName,
      description: newDeptDesc || undefined,
      memberCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setDepartments([...departments, newDept]);
    setIsDeptDialogOpen(false);
    setNewDeptName("");
    setNewDeptDesc("");
    toast({ title: "Département créé", variant: "success" });
  };

  const handleUpdateDepartment = () => {
    if (!editingDept) return;
    setDepartments(
      departments.map((d) =>
        d.id === editingDept.id
          ? { ...d, name: newDeptName, description: newDeptDesc }
          : d,
      ),
    );
    setIsDeptDialogOpen(false);
    setEditingDept(null);
    toast({ title: "Département modifié", variant: "success" });
  };

  const handleDeleteDepartment = (deptId: string) => {
    const membersInDept = departmentMembers.filter(
      (dm) => dm.departmentId === deptId,
    );
    if (membersInDept.length > 0) {
      toast({
        title: "Impossible",
        description: "Ce département contient encore des membres.",
        variant: "destructive",
      });
      return;
    }
    setDepartments(departments.filter((d) => d.id !== deptId));
    toast({ title: "Département supprimé" });
  };

  const handleAssignMemberToDepartment = (
    userId: string,
    departmentId: string,
  ) => {
    // Retirer l'ancien département
    setDepartmentMembers((prev) => prev.filter((dm) => dm.userId !== userId));
    if (departmentId) {
      setDepartmentMembers((prev) => [
        ...prev,
        { userId, departmentId, role: "member" },
      ]);
    }
    toast({ title: "Affectation mise à jour", variant: "success" });
  };

  const stats = {
    totalMembers: members.filter((m) => m.status === "active").length,
    totalMeetings: members.reduce((acc, m) => acc + m.meetingsCount, 0),
    totalActions: members.reduce((acc, m) => acc + m.actionsCompleted, 0),
    activeThisWeek: Math.floor(members.length * 0.8),
    totalDepartments: departments.length,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Équipe</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les membres de votre équipe, leurs permissions et
            l&apos;organisation par départements.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSaveAll} disabled={isSaving} variant="outline">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
          <Dialog
            open={isInviteDialogOpen}
            onOpenChange={setIsInviteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Inviter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Inviter un membre</DialogTitle>
                <DialogDescription>
                  Envoyez une invitation à rejoindre votre équipe sur MeetMind.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="collaborateur@email.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select
                    value={inviteRole}
                    onValueChange={(val) =>
                      setInviteRole(val as "admin" | "member")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Membre</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsInviteDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button onClick={handleInvite}>
                  <Send className="h-4 w-4 mr-2" /> Envoyer l&apos;invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Membres</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">+2 ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Réunions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMeetings}</div>
            <p className="text-xs text-muted-foreground">
              Générées par l&apos;équipe
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Actions complétées
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActions}</div>
            <p className="text-xs text-muted-foreground">
              Taux de complétion 87%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Actifs cette semaine
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Sur {stats.totalMembers} membres
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Départements</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDepartments}</div>
            <p className="text-xs text-muted-foreground">
              Structuration d&apos;équipe
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="members">Membres</TabsTrigger>
          <TabsTrigger value="invitations">
            Invitations{" "}
            {invitations.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {invitations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="organization">Organisation</TabsTrigger>
        </TabsList>

        {/* Membres */}
        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Membres de l&apos;équipe</CardTitle>
              <CardDescription>
                {stats.totalMembers} membres actifs dans votre espace de travail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{member.name}</p>
                          {getRoleBadge(member.role)}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {member.email}
                          </span>
                          {member.status === "active" && (
                            <>
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />{" "}
                                {member.meetingsCount} réunions
                              </span>
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />{" "}
                                {member.actionsCompleted} actions
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(member.status)}
                      {member.role !== "owner" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeRole(member.id, "admin")
                              }
                              disabled={member.role === "admin"}
                            >
                              <Shield className="h-4 w-4 mr-2" /> Passer
                              administrateur
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeRole(member.id, "member")
                              }
                              disabled={member.role === "member"}
                            >
                              <Users className="h-4 w-4 mr-2" /> Passer membre
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() =>
                                handleRemoveMember(member.id, member.name)
                              }
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Retirer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invitations */}
        <TabsContent value="invitations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Invitations en attente</CardTitle>
              <CardDescription>
                Ces invitations n&apos;ont pas encore été acceptées
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invitations.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    Aucune invitation en attente
                  </p>
                  <Button
                    variant="link"
                    onClick={() => setIsInviteDialogOpen(true)}
                    className="mt-2"
                  >
                    Inviter des membres
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {invitations.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{inv.email}</p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />{" "}
                              {inv.role === "admin"
                                ? "Administrateur"
                                : "Membre"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Expire le{" "}
                              {new Date(inv.expiresAt).toLocaleDateString(
                                "fr-FR",
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResendInvitation(inv.email)}
                        >
                          <Send className="h-4 w-4 mr-2" /> Renvoyer
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCancelInvitation(inv.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organisation */}
        <TabsContent value="organization" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Départements</CardTitle>
                <CardDescription>
                  Organisez votre équipe par services ou pôles
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  setEditingDept(null);
                  setNewDeptName("");
                  setNewDeptDesc("");
                  setIsDeptDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Nouveau département
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map((dept) => {
                  const manager = members.find((m) => m.id === dept.managerId);
                  return (
                    <div
                      key={dept.id}
                      className="flex items-start justify-between p-4 rounded-lg border"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{dept.name}</h3>
                          <Badge variant="outline">
                            {dept.memberCount} membre(s)
                          </Badge>
                        </div>
                        {dept.description && (
                          <p className="text-sm text-muted-foreground">
                            {dept.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Responsable :
                            </span>
                            <Select
                              value={dept.managerId || "none"}
                              onValueChange={(val) =>
                                handleSetDepartmentManager(
                                  dept.id,
                                  val === "none" ? undefined : val,
                                )
                              }
                            >
                              <SelectTrigger className="w-[200px] h-8">
                                <SelectValue placeholder="Aucun responsable" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Aucun</SelectItem>
                                {members
                                  .filter((m) => m.status === "active")
                                  .map((member) => (
                                    <SelectItem
                                      key={member.id}
                                      value={member.id}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-5 w-5">
                                          <AvatarFallback className="text-xs">
                                            {member.name
                                              .slice(0, 2)
                                              .toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                        {member.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Créé le{" "}
                            {new Date(dept.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Menu Dropdown pour modifier/supprimer */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingDept(dept);
                                setNewDeptName(dept.name);
                                setNewDeptDesc(dept.description || "");
                                setIsDeptDialogOpen(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4 mr-2" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => handleDeleteDepartment(dept.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
                {departments.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Aucun département pour le moment</p>
                    <Button
                      variant="link"
                      onClick={() => setIsDeptDialogOpen(true)}
                      className="mt-2"
                    >
                      Créer votre premier département
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Affectation des membres aux départements */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Affectation des membres</CardTitle>
              <CardDescription>
                Attribuez chaque membre à un département
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members
                  .filter((m) => m.status === "active")
                  .map((member) => {
                    const currentDept = departments.find((d) =>
                      departmentMembers.some(
                        (dm) =>
                          dm.userId === member.id && dm.departmentId === d.id,
                      ),
                    );
                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {member.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <Select
                          value={currentDept?.id || "none"}
                          onValueChange={(val) =>
                            handleAssignMemberToDepartment(
                              member.id,
                              val === "none" ? "" : val,
                            )
                          }
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Aucun département" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Aucun</SelectItem>
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Plan et limites */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" /> Plan actuel :
            Professionnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Membres utilisés</span>
              <span className="font-medium">{stats.totalMembers} / 10</span>
            </div>
            <div className="h-2 rounded-full bg-primary/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(stats.totalMembers / 10) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              ✨ Passez au plan Enterprise pour plus de membres et des
              fonctionnalités avancées
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              Gérer mon abonnement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialogue de création / modification de département */}
      <Dialog open={isDeptDialogOpen} onOpenChange={setIsDeptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDept ? "Modifier le département" : "Créer un département"}
            </DialogTitle>
            <DialogDescription>
              {editingDept
                ? "Modifiez les informations du département."
                : "Ajoutez un nouveau département à votre organisation."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom du département *</Label>
              <Input
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                placeholder="Ex: Commercial, Technique, RH"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (optionnelle)</Label>
              <Input
                value={newDeptDesc}
                onChange={(e) => setNewDeptDesc(e.target.value)}
                placeholder="Rôle ou objectif du département"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeptDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={
                editingDept ? handleUpdateDepartment : handleAddDepartment
              }
            >
              {editingDept ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getRoleBadge(role: "owner" | "admin" | "member") {
  const styles = {
    owner: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    admin: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    member: "bg-muted text-muted-foreground",
  };
  const labels = { owner: "Propriétaire", admin: "Admin", member: "Membre" };
  return (
    <Badge variant="outline" className={styles[role]}>
      {labels[role]}
    </Badge>
  );
}
