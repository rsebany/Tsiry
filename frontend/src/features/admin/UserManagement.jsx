import { useEffect, useState, useCallback } from 'react';
import { Users, Plus, Pencil, Trash2, Search, Shield } from 'lucide-react';
import DataState from '@/components/DataState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/adminService';
import toast from 'react-hot-toast';

const ROLE_FILTERS = ['ALL', 'PATIENT', 'AGENT', 'MEDECIN'];
const ROLE_LABELS = { PATIENT: 'Marary', AGENT: 'Mpandraharaha', MEDECIN: 'Dokotera' };
const ROLE_COLORS = { PATIENT: 'bg-emerald-500/10 text-emerald-600', AGENT: 'bg-sky-500/10 text-sky-600', MEDECIN: 'bg-violet-500/10 text-violet-600' };

const emptyUser = { nom: '', prenom: '', email: '', password: '', role_type: 'PATIENT', telephone: '', matricule: '', specialite: '', num_secu: '' };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ ...emptyUser });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (roleFilter !== 'ALL') params.role = roleFilter;
      if (search) params.search = search;
      const res = await getUsers(params);
      setUsers(res.data || []);
      setPagination(res.pagination || { total: 0, page: 1, pages: 1 });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, search]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditingUser(null);
    setForm({ ...emptyUser });
    setDialogOpen(true);
  }

  function openEdit(u) {
    setEditingUser(u);
    setForm({
      nom: u.nom || '', prenom: u.prenom || '', email: u.email || '', password: '',
      role_type: u.role_type || 'PATIENT', telephone: u.telephone || '',
      matricule: u.matricule || '', specialite: u.specialite || '', num_secu: u.num_secu || '',
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editingUser) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await updateUser(editingUser.id_utilisateur, payload);
        toast.success('Nohavaozina ny mpampiasa');
      } else {
        if (!form.password) { toast.error('Mila tenimiafina'); setSaving(false); return; }
        await createUser(form);
        toast.success('Novo nampidirina ny mpampiasa');
      }
      setDialogOpen(false);
      load(pagination.page);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Nisy olana');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Hanaiso ${name} ve ianao?`)) return;
    try {
      await deleteUser(id);
      toast.success('Nampoasina ny mpampiasa');
      load(pagination.page);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Nisy olana');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mpampiasa</h1>
          <p className="text-sm text-muted-foreground">Fitantanana mpampiasa rehetra</p>
        </div>
      </div>

      <Card className="border-0 shadow-md ring-1 ring-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-4 w-4 text-primary" />
              Mpampiasa rehetra
              <Badge variant="secondary">{pagination.total}</Badge>
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tadiava…" className="h-9 pl-9 w-48" />
              </div>
              {ROLE_FILTERS.map((r) => (
                <Button key={r} size="sm" variant={roleFilter === r ? 'default' : 'outline'} className="h-9 rounded-full px-3" onClick={() => setRoleFilter(r)}>
                  {r === 'ALL' ? 'Rehetra' : ROLE_LABELS[r] || r}
                </Button>
              ))}
              <Button size="sm" className="h-9 gap-1.5" onClick={openCreate}>
                <Plus className="h-4 w-4" /> Manampy
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataState loading={loading} error={error} compact>
            {users.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">Tsy misy mpampiasa</p>
            ) : (
              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u.id_utilisateur} className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3 transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                        {u.prenom?.[0]}{u.nom?.[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{u.prenom} {u.nom}</p>
                        <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${ROLE_COLORS[u.role_type] || ''}`}>{ROLE_LABELS[u.role_type] || u.role_type}</Badge>
                      {!u.actif && <Badge variant="destructive" className="text-[10px]">Tsy miasa</Badge>}
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(u)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(u.id_utilisateur, `${u.prenom} ${u.nom}`)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {pagination.pages > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <Button key={i + 1} size="sm" variant={pagination.page === i + 1 ? 'default' : 'outline'} onClick={() => load(i + 1)}>{i + 1}</Button>
                ))}
              </div>
            )}
          </DataState>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg p-6">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Hanavao mpampiasa' : 'Manampy mpampiasa'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Anarana</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Fanampin'anarana</Label><Input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            {!editingUser && <div className="space-y-1.5"><Label>Tenimiafina</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>}
            <div className="space-y-1.5">
              <Label>Andraikitra</Label>
              <Select value={form.role_type} onValueChange={(v) => setForm({ ...form, role_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PATIENT">Marary</SelectItem>
                  <SelectItem value="AGENT">Mpandraharaha</SelectItem>
                  <SelectItem value="MEDECIN">Dokotera</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Telefaona</Label><Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></div>
            {(form.role_type === 'MEDECIN' || form.role_type === 'AGENT') && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Matricule</Label><Input value={form.matricule} onChange={(e) => setForm({ ...form, matricule: e.target.value })} /></div>
                {form.role_type === 'MEDECIN' && <div className="space-y-1.5"><Label>Spécialité</Label><Input value={form.specialite} onChange={(e) => setForm({ ...form, specialite: e.target.value })} /></div>}
              </div>
            )}
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
