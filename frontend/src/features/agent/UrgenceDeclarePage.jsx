import { useState } from 'react';
import { HeartPulse, Info, Stethoscope, Ticket, Activity, Gauge } from 'lucide-react';
import useUrgenceDeclare, { triageSchema } from '@/features/agent/hooks/useUrgenceDeclare';
import UrgenceResultPanel from '@/features/agent/components/UrgenceResultPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

// ============ Tsiry DS — Déclaration d'urgence (triage par ticket) ============
// Seul l'ID du ticket (colonne ID de la file) est saisi par l'agent : le backend retrouve
// l'association patient, crée le cas et recalculé la position dans la file.
const FIELDS = [
  { name: 'pouls', label: 'Fitempo (bpm)', placeholder: 'ohatra. 88', icon: HeartPulse },
  { name: 'tension_systolique', label: 'Tosika (mmHg)', placeholder: 'ohatra. 120', icon: Gauge },
  { name: 'saturation_o2', label: 'Oksizenina O₂ (%)', placeholder: 'ohatra. 96', icon: Activity },
];

export default function UrgenceDeclarePage() {
  const { medecins, loadingMedecins, result, loading, submit, clearResult } = useUrgenceDeclare();
  const [values, setValues] = useState({
    id_ticket: '',
    pouls: '',
    tension_systolique: '',
    saturation_o2: '',
    id_medecin: '',
  });
  const [errors, setErrors] = useState({});

  function setField(key, value) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...values,
      id_medecin: values.id_medecin ? values.id_medecin : undefined,
    };
    const parsed = triageSchema.safeParse(payload);
    if (!parsed.success) {
      const map = {};
      for (const issue of parsed.error.issues) map[issue.path.join('.')] = issue.message;
      setErrors(map);
      return;
    }
    await submit(parsed.data);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-[28px]">
          Manambara vonjy maika
        </h1>
        <p className="mt-0.5 text-[13.5px] text-text-muted">
          Ampidiro ny ID ny tiketo hita ao amin'ny filaharana : ho hita ho azy ny marary.
        </p>
      </header>

      {result && <UrgenceResultPanel result={result} onDismiss={clearResult} />}

      <Card>
        <CardHeader>
          <CardTitle>Fanasokajiana amin'ny alalan'ny tiketo</CardTitle>
          <CardDescription>
            Ampidiro ny ID ny tiketo sy ny mari-pitsaboana. Kajiana amin'ny mpanjaka ny naoty ny fahafahan'ny tranga.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="ID ny tiketo"
              type="number"
              min={1}
              placeholder="ohatra. 17 — hita ao amin'ny filaharana"
              icon={<Ticket className="h-4 w-4 text-text-muted" />}
              value={values.id_ticket}
              onChange={(e) => setField('id_ticket', e.target.value)}
              error={errors.id_ticket}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              {FIELDS.map(({ name, label, placeholder, icon: Icon }) => (
                <Input
                  key={name}
                  label={label}
                  type="number"
                  min={0}
                  placeholder={placeholder}
                  icon={<Icon className="h-4 w-4 text-text-muted" />}
                  value={values[name]}
                  onChange={(e) => setField(name, e.target.value)}
                  error={errors[name]}
                />
              ))}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="medecin-select">Dokotera mpitsabo (tsy voatery)</Label>
              <Select
                value={values.id_medecin ? String(values.id_medecin) : 'none'}
                onValueChange={(v) => setField('id_medecin', v === 'none' ? '' : v)}
              >
                <SelectTrigger id="medecin-select" className="w-full">
                  <SelectValue placeholder="— Tsy misy —" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Tsy misy —</SelectItem>
                  {loadingMedecins && (
                    <div className="px-2 py-2">
                      <Skeleton className="h-5 w-full" />
                    </div>
                  )}
                  {medecins.map((m) => (
                    <SelectItem key={m.id_utilisateur} value={String(m.id_utilisateur)}>
                      {m.specialite ? `Dr ${m.prenom} ${m.nom} — ${m.specialite}` : `Dr ${m.prenom} ${m.nom}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-2/50 px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
              <p className="text-xs leading-relaxed text-text-muted">
                Ny tsanganana <strong className="text-text-2">ID</strong> ao amin'ny filaharana no ilaina ampidirina eto. Ny
                frontend dia tsy mandefa velively ny maha-izy ny marary ; ny tiketo tsy misy fifamatorana dia
                voarohirohy ho azy amin'ny profil tsy mitonona anarana ary kajiana indray ny laharam-pahamehana
                MENA / LAORANJY / MAITSO ao amin'ny filaharana.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading || result !== null}>
              {loading ? (
                <>Famakafakana mitohy…</>
              ) : (
                <>
                  <Stethoscope className="h-5 w-5" />
                  Manambara ny tranga
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}