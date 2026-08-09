import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Stethoscope,
} from 'lucide-react';
import useBookAppointment from '@/features/patient/hooks/useBookAppointment';
import { rdvSchema } from '@/features/patient/validation/rdvSchema';
import { SLOT } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// ============ Tsiry DS — Nouveau rendez-vous (wizard 5 étapes) ============
// Données réelles (API /specialites, /medecins, POST /rendezvous/book).
const STEPS = ['Spécialité', 'Médecin', 'Date', 'Heure', 'Confirmation'];
const DAYS = 14;

const pad = (n) => String(n).padStart(2, '0');

function initials(nom, prenom) {
  return `${prenom?.[0] ?? ''}${nom?.[0] ?? ''}`.toUpperCase() || '?';
}

function dayLabel(date) {
  return date
    .toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
    .replace('.', '')
    .trim();
}

function fullDateLabel(date) {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const SELECTION_CARD =
  'flex items-center gap-3 rounded-lg border p-4 text-left transition-[border-color,background-color,box-shadow] duration-150 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

const SELECTION_TPL = (active) =>
  cn(
    SELECTION_CARD,
    active
      ? 'border-primary bg-green-soft shadow-xs'
      : 'border-border bg-surface hover:border-strong hover:bg-surface-2'
  );

export default function BookAppointmentPage() {
  const { specialites, medecins, loadingMedecins, conflict, loadSpecialites, loadMedecins, submit } =
    useBookAppointment();

  const [step, setStep] = useState(0);
  const [specialite, setSpecialite] = useState('');
  const [medecin, setMedecin] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [motif, setMotif] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSpecialites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dates = useMemo(() => {
    const out = [];
    const now = new Date();
    for (let i = 1; i <= DAYS; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      if (d.getDay() !== SLOT.CLOSED_DAY) out.push(d);
    }
    return out;
  }, []);

  const slots = useMemo(() => {
    const list = [];
    const now = new Date();
    const isToday =
      selectedDate &&
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate();
    for (let h = SLOT.HOURS_START; h < SLOT.HOURS_END; h++) {
      if (isToday && h <= now.getHours()) continue;
      list.push(`${pad(h)}:00`);
    }
    return list;
  }, [selectedDate]);

  function buildDateTime() {
    const [h, m] = selectedTime.split(':').map(Number);
    const d = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), h, m, 0, 0);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function chooseSpecialite(value) {
    if (value === specialite) return;
    setSpecialite(value);
    setMedecin(null);
    setError(null);
    loadMedecins(value);
  }

  function goTo(next) {
    setError(null);
    setStep(next);
  }

  function resetAll() {
    setStep(0);
    setSpecialite('');
    setMedecin(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setMotif('');
    setError(null);
    setSuccess(false);
  }

  async function handleConfirm() {
    setError(null);
    const date_heure = buildDateTime();
    const parsed = rdvSchema.safeParse({ id_medecin: medecin.id_utilisateur, date_heure, motif: motif.trim() || undefined });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Vérifiez les informations saisies.');
      return;
    }
    const res = await submit(parsed.data);
    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || 'Réservation impossible.');
    }
  }

  const canContinue =
    (step === 0 && specialite !== '') ||
    (step === 1 && medecin !== null) ||
    (step === 2 && selectedDate !== null) ||
    (step === 3 && selectedTime !== null) ||
    step === 4;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-[28px]">Nouveau rendez-vous</h1>
        <p className="mt-0.5 text-[13.5px] text-text-muted">Réservez un créneau avec un médecin de l'établissement.</p>
      </header>

      {success ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-soft">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Rendez-vous confirmé</h2>
              <p className="mt-1 text-sm text-text-muted">
                {medecin.specialite} — Dr {medecin.prenom} {medecin.nom}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant="success">Planifié</Badge>
              <span className="text-sm font-semibold text-text">
                {selectedDate ? fullDateLabel(selectedDate) : ''} à {selectedTime}
              </span>
            </div>
            <p className="text-xs text-text-muted">Un email de confirmation sera disponible dans votre historique.</p>
            <Button variant="outline" onClick={resetAll}>
              Réserver un autre créneau
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Stepper steps={STEPS} current={step} />

          <Card>
            <CardHeader>
              <CardTitle>{STEPS[step]}</CardTitle>
              <CardDescription>{stepDescriptions[step]}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {step === 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {specialites.length === 0 && (
                    <>
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </>
                  )}
                  {specialites.map((s) => {
                    const active = s === specialite;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => chooseSpecialite(s)}
                        className={SELECTION_TPL(active)}
                      >
                        <span
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                            active ? 'bg-primary text-white' : 'bg-surface-2 text-text-muted'
                          )}
                        >
                          <Stethoscope className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-foreground">{s}</span>
                          <span className="block text-xs text-text-muted">Choisir cette spécialité</span>
                        </span>
                        {active && <Check className="h-5 w-5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 1 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {loadingMedecins && (
                    <>
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </>
                  )}
                  {!loadingMedecins && medecins.length === 0 && (
                    <p className="text-sm text-text-muted">
                      Aucun médecin disponible pour la spécialité « {specialite} ».
                    </p>
                  )}
                  {medecins.map((m) => {
                    const active = medecin?.id_utilisateur === m.id_utilisateur;
                    return (
                      <button
                        key={m.id_utilisateur}
                        type="button"
                        onClick={() => {
                          setMedecin(m);
                          setError(null);
                        }}
                        className={SELECTION_TPL(active)}
                      >
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="text-xs">{initials(m.nom, m.prenom)}</AvatarFallback>
                        </Avatar>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-foreground">
                            Dr {m.prenom} {m.nom}
                          </span>
                          <span className="block text-xs text-text-muted">{m.specialite || 'Général'}</span>
                        </span>
                        {active && <Check className="h-5 w-5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                  {dates.map((d) => {
                    const active = selectedDate?.getTime() === d.getTime();
                    return (
                      <button
                        key={d.getTime()}
                        type="button"
                        onClick={() => {
                          setSelectedDate(d);
                          setSelectedTime(null);
                          setError(null);
                        }}
                        className={cn(
                          'flex flex-col items-center gap-0.5 rounded-lg border px-3 py-3 text-center transition-[border-color,background-color,box-shadow] duration-150 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          active
                            ? 'border-primary bg-green-soft shadow-xs'
                            : 'border-border bg-surface hover:border-strong hover:bg-surface-2'
                        )}
                      >
                        <span className={cn('text-[13px] font-semibold', active ? 'text-green-deep' : 'text-text-2')}>
                          {dayLabel(d)}
                        </span>
                        <span className={cn('text-xs', active ? 'text-primary' : 'text-text-faint')}>disponible</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 3 && (
                <>
                  <p className="flex items-center gap-2 text-sm text-text-2">
                    <CalendarDays className="h-4 w-4 text-text-muted" />
                    {selectedDate ? (
                      <span className="font-semibold text-foreground capitalize">{fullDateLabel(selectedDate)}</span>
                    ) : (
                      'Choisissez une date'
                    )}
                  </p>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                    {slots.map((t) => {
                      const active = t === selectedTime;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setSelectedTime(t);
                            setError(null);
                          }}
                          className={cn(
                            'flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-[border-color,background-color,box-shadow] duration-150 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            active
                              ? 'border-primary bg-primary text-white shadow-xs'
                              : 'border-border bg-surface text-text-2 hover:border-strong hover:bg-surface-2'
                          )}
                        >
                          <Clock className="h-4 w-4" />
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <div className="space-y-3">
                    <SummaryRow label="Spécialité" value={specialite}>
                      <Badge variant="success">{specialite}</Badge>
                    </SummaryRow>
                    <SummaryRow label="Médecin" value={`Dr ${medecin?.prenom} ${medecin?.nom}`}>
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[11px]">
                          {medecin ? initials(medecin.nom, medecin.prenom) : '?'}
                        </AvatarFallback>
                      </Avatar>
                    </SummaryRow>
                    <SummaryRow label="Date" value={`${selectedDate && fullDateLabel(selectedDate)}`} />
                    <SummaryRow label="Heure" value={selectedTime}>
                      <Badge variant="default">{selectedTime}</Badge>
                    </SummaryRow>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="motif" className="text-[13px] font-medium text-text-2">
                      Motif (optionnel)
                    </label>
                    <Textarea
                      id="motif"
                      value={motif}
                      onChange={(e) => setMotif(e.target.value)}
                      rows={3}
                      placeholder="Décrivez brièvement le motif de la consultation"
                    />
                  </div>

                  {error && (
                    <Alert variant="error">
                      <AlertTitle className="mb-1">Réservation impossible</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {conflict && !error && (
                    <Alert variant="error">
                      <AlertTitle className="mb-1">Créneau déjà réservé</AlertTitle>
                      <AlertDescription>Ce médecin est déjà réservé à ce créneau. Choisissez un autre horaire.</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
                <Button variant="outline" onClick={() => goTo(step - 1)} disabled={step === 0}>
                  <ArrowLeft className="h-4 w-4" />
                  Précédent
                </Button>
                {step < 4 ? (
                  <Button onClick={() => goTo(step + 1)} disabled={!canContinue}>
                    Continuer
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleConfirm}>
                    <CheckCircle2 className="h-4 w-4" />
                    Confirmer la réservation
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-text-faint">
            Un email de confirmation sera disponible dans votre historique.
          </p>
        </>
      )}
    </div>
  );
}

const stepDescriptions = [
  'Choisissez une spécialité pour voir les médecins disponibles.',
  'Sélectionnez le praticien que vous souhaitez consulter.',
  'Choisissez le jour de votre visite (du lundi au samedi).',
  'Sélectionnez un créneau entre 8h et 18h.',
  'Vérifiez les informations et confirmez votre rendez-vous.',
];

function Stepper({ steps, current }) {
  return (
    <ol className="flex flex-wrap items-center gap-y-3">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-2 last:flex-none sm:gap-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors duration-150 ease-soft',
                  done && 'bg-primary text-white',
                  active && 'bg-surface text-primary ring-2 ring-primary',
                  !done && !active && 'bg-surface-2 text-text-faint'
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  'text-[13px] font-semibold',
                  done && 'text-primary',
                  active && 'text-foreground',
                  !done && !active && 'text-text-faint'
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className="mx-1 hidden h-px w-8 bg-border sm:block md:w-12" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function SummaryRow({ label, value, children }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-2/50 px-4 py-3">
      <div className="flex items-center gap-2.5">
        {children}
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}