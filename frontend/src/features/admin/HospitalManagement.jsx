import { useEffect, useState } from 'react';
import { Building2, Plus, Pencil, Trash2 } from 'lucide-react';
import DataState from '@/components/DataState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { getHospitals, createHospital, updateHospital, deleteHospital } from '@/services/adminService';
import toast from 'react-hot-toast';

const TYPES = ['CHU', 'Public', 'Privé', 'Militaire'];
const TYPE_COLORS = { CHU: 'bg-blue-500/10 text-blue-600', Public: 'bg-emerald-500/10 text-emerald-600', Privé: 'bg-violet-500/10 text-violet-600', Militaire: 'bg-orange-500/10 text-orange-600' };

const emptyHosp = { nom: '', latitude: '', longitude: '', type: 'Public' };

export default function HospitalManagement() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...emptyHosp });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await getHospitals();
      setHospitals(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm({ ...emptyHosp }); setDialogOpen(true); }

  function openEdit(h) {
    setEditing(h);
    setForm({ nom: h.nom || '', latitude: h.latitude || '', longitude: h.longitude || '', type: h.type || 'Public' });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.nom || !form.latitude || !form.longitude) { toast.error('Mila anarana sy toerana'); return; }
    setSaving(true);
    try {
      const payload = { ...form, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude) };
      if (editing) {
        await updateHospital(editing.id_hopital, payload);
        toast.success('Nohavaozina');
      } else {
        await createHospital(payload);
        toast.success('Novo nampidirina');
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Nisy olana');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Hanaiso ${name} ve ianao?`)) return;
    try {
      await deleteHospital(id);
      toast.success('Nampoasina');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Nisy olana');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hopitaly</h1>
          <p className="text-sm text-muted-foreground">Fitantanana hopitaly rehetra</p>
        </div>
      </div>

      <Card className="border-0 shadow-md ring-1 ring-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-4 w-4 text-primary" />
              Hopitaly rehetra
              <Badge variant="secondary">{hospitals.length}</Badge>
            </CardTitle>
            <Button size="sm" className="h-9 gap-1.5" onClick={openCreate}>
              <Plus className="h-4 w-4" /> Manampy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataState loading={loading} error={error} compact>
            {hospitals.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">Tsy misy hopitaly</p>
            ) : (
              <div className="space-y-2">
                {hospitals.map((h) => (
                  <div key={h.id_hopital} className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3 transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{h.nom}</p>
                        <p className="text-xs text-muted-foreground">{h.latitude}, {h.longitude}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {h.type && <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${TYPE_COLORS[h.type] || ''}`}>{h.type}</Badge>}
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(h)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(h.id_hopital, h.nom)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DataState>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg p-6">
          <DialogHeader>
            <DialogTitle>{editing ? 'Hanavao hopitaly' : 'Manampy hopitaly'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5"><Label>Anarana</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="ohatra: CHU ..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Latitude</Label><Input type="number" step="0.0001" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="-18.9136" /></div>
              <div className="space-y-1.5"><Label>Longitude</Label><Input type="number" step="0.0001" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="47.5210" /></div>
            </div>
            <div className="space-y-1.5">
              <Label>Karazana</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Faingo</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Miantso…' : 'Tehirizo'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
