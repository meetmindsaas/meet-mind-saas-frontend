// app/page.tsx
import { StatsCards } from "./components/StatsCards";
import { RecentMeetings } from "./components/RecentMeetings";
import { QuickImport } from "./components/QuickImport";
import { AIActivityFeed } from "./components/AIActivityFeed";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">
          Vue d&apos;ensemble de votre activité IA
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RecentMeetings />
          <QuickImport />
        </div>
        <div className="space-y-6">
          <AIActivityFeed />
        </div>
      </div>
    </div>
  );
}
