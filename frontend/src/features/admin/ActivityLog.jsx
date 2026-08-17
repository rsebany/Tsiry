import { useEffect, useState } from 'react';
import { FileText, RefreshCw } from 'lucide-react';
import DataState from '@/components/DataState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getLogs } from '@/services/adminService';
import { formatDate } from '@/lib/constants';

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getLogs({ limit: 100 });
      setLogs(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Journal asa</h1>
            <p className="text-sm text-muted-foreground">Tsy maintsy ity ny asa rehetra natao amin'ny rafitra</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Havaozina
        </Button>
      </div>

      <DataState loading={loading} error={error}>
        <Card className="border-0 shadow-md ring-1 ring-border">
          <CardContent className="p-0">
            <div className="divide-y">
              {logs.length === 0 && (
                <p className="p-6 text-center text-muted-foreground">Tsy misy asa</p>
              )}
              {logs.map((l) => (
                <div key={l.id_journal} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                  <Badge variant="outline" className="shrink-0 min-w-[90px] justify-center">{l.action}</Badge>
                  <span className="flex-1 text-sm text-muted-foreground truncate">{l.details || '—'}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{l.nom ? `${l.prenom} ${l.nom}` : '—'}</span>
                  <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">{formatDate(l.date_action)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DataState>
    </div>
  );
}
