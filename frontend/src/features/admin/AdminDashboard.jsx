import { useEffect, useState } from 'react';
import { Users, Building2, Ticket, HeartPulse, Activity, FileText, Shield } from 'lucide-react';
import StatTile from '@/components/StatTile';
import DataState from '@/components/DataState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStats, getLogs } from '@/services/adminService';
import { formatDate } from '@/lib/constants';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [s, l] = await Promise.all([getStats(), getLogs({ limit: 8 })]);
        setStats(s);
        setLogs(l);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tabilao</h1>
          <p className="text-sm text-muted-foreground">Tadidio ny rafitra manontolo</p>
        </div>
      </div>

      <DataState loading={loading} error={error}>
        {stats && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile label="Mpampiasa" value={stats.utilisateurs?.total || 0} icon={Users} tone="emerald" sub={`${stats.utilisateurs?.actifs || 0} miasa`} />
              <StatTile label="Tiketo androany" value={stats.tickets?.total || 0} icon={Ticket} tone="teal" sub={`${stats.tickets?.en_attente || 0} miandry`} />
              <StatTile label="Firafisana androany" value={stats.rendez_vous?.total || 0} icon={HeartPulse} tone="sky" />
              <StatTile label="Vonjy maika" value={stats.urgences?.total || 0} icon={Activity} tone="rose" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-0 shadow-md ring-1 ring-border">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    Hopitaly
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-extrabold">{stats.hopitaux?.total || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">eno an-tsarainteny</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md ring-1 ring-border sm:col-span-2 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Asa vao farany
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[220px] overflow-y-auto">
                  {logs.length === 0 && <p className="text-sm text-muted-foreground">Tsy misy asa</p>}
                  {logs.map((l) => (
                    <div key={l.id_journal} className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm">
                      <Badge variant="outline" className="shrink-0">{l.action}</Badge>
                      <span className="flex-1 truncate text-muted-foreground">{l.details || '—'}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{l.nom ? `${l.prenom} ${l.nom}` : '—'}</span>
                      <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">{formatDate(l.date_action)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </DataState>
    </div>
  );
}
