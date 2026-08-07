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
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/medisaas';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// ============ Medisaas — Nouveau rendez-vous (wizard 5 étapes) ============
// Parcours guidé : Spécialité → Médecin → Date → Heure → Confirmation.
// Données réelles (API /specialites, /medecins, POST /rendezvous/book).
// [Maintenu après correction UI/form : les champs refus d'afficher.]

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

export default function BookAppointmentPage() {
  const { specialites, medecins, loadingMedecins, conflict, lastRdv, loadSpecialites, loadMedecins, submit } =
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
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Nouveau rendez-vous</h1>
          <p className="text-sm text-slate-500">Réservez un créneau avec un médecin de l'établissement.</p>
        </div>
      </header>

      {success ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Rendez-vous confirmé</h2>
              <p className="mt-1 text-sm text-slate-500">
                {medecin.specialite} — Dr {medecin.prenom} {medecin.nom}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Badge variant="success">Planifié</Badge>
              <span className="text-sm font-semibold text-slate-700">
                {selectedDate ? fullDateLabel(selectedDate) : ''} à {selectedTime}
              </span>
            </div>
            <p className="text-xs text-slate-400">Un email de confirmation sera disponible dans votre historique.</p>
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
                        className={`group flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 ${
                          active
                            ? 'border-emerald-500 bg-emerald-50/70 shadow-[0_4px_14px_rgba(5,150,105,0.15)]'
                            : 'border-slate-200 bg-white/70 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]'
                        }`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/70'}`}>
                          <Stethoscope className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-800">{s}</p>
                          <p className="text-xs text-slate-400">Choisir cette spécialité</p>
                        </div>
                        {active && <Check className="h-5 w-5 text-emerald-600" />}
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
                    <p className="text-sm text-slate-500">
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
                        className={`group flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 ${
                          active
                            ? 'border-emerald-500 bg-emerald-50/70 shadow-[0_4px_14px_rgba(5,150,105,0.15)]'
                            : 'border-slate-200 bg-white/70 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]'
                        }`}
                      >
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
                            {initials(m.nom, m.prenom)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-800">Dr {m.prenom} {m.nom}</p>
                          <p className="text-xs text-slate-400">{m.specialite || 'Général'}</p>
                        </div>
                        {active && <Check className="h-5 w-5 text-emerald-600" />}
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
                        className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 ${
                          active
                            ? 'border-emerald-500 bg-emerald-50/70 shadow-[0_4px_14px_rgba(5,150,105,0.15)]'
                            : 'border-slate-200 bg-white/70 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]'
                        }`}
                      >
                        <span className={active ? 'text-sm font-bold text-emerald-700' : 'text-sm font-semibold text-slate-600'}>
                          {dayLabel(d)}
                        </span>
                        <span className={`text-xs ${active ? 'text-emerald-600' : 'text-slate-400'}`}>disponible</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 3 && (
                <>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    {selectedDate ? <span className="font-semibold text-slate-700 capitalize">{fullDateLabel(selectedDate)}</span> : 'Choisissez une date'}
                  </div>
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
                          className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 ${
                            active
                              ? 'border-emerald-500 bg-emerald-500 text-white shadow-[0_4px_14px_rgba(5,150,105,0.3)]'
                              : 'border-slate-200 bg-white/70 text-slate-700 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]'
                          }`}
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
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-emerald-100 text-xs text-emerald-700">
                          {medecin ? initials(medecin.nom, medecin.prenom) : '?'}
                        </AvatarFallback>
                      </Avatar>
                    </SummaryRow>
                    <SummaryRow label="Date" value={`${selectedDate && fullDateLabel(selectedDate)}`} />
                    <SummaryRow label="Heure" value={selectedTime}>
                      <Badge variant="default">{selectedTime}</Badge>
                    </SummaryRow>
                  </div>

                  <div className="rounded-xl bg-slate-50/80 p-3">
                    <label htmlFor="motif" className="block text-sm font-semibold text-slate-700">
                      Motif (optionnel)
                    </label>
                    <textarea
                      id="motif"
                      value={motif}
                      onChange={(e) => setMotif(e.target.value)}
                      rows={3}
                      placeholder="Décrivez brièvement le motif de la consultation"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/70 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm backdrop-blur-sm transition-all placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertTitle className="mb-1">Réservation impossible</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {conflict && !error && (
                    <Alert variant="destructive">
                      <AlertTitle className="mb-1">Créneau déjà réservé</AlertTitle>
                      <AlertDescription>Ce médecin est déjà réservé à ce créneau. Choisissez un autre horaire.</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
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

          <p className="text-center text-xs text-slate-400">
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
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition-all duration-300 ${
                  done
                    ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-[0_4px_12px_rgba(5,150,105,0.3)]'
                    : active
                      ? 'bg-white text-emerald-600 ring-2 ring-emerald-500 shadow-[0_4px_12px_rgba(5,150,105,0.2)]'
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={`text-sm font-semibold ${
                  done ? 'text-emerald-700' : active ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className="mx-1 hidden h-px w-8 bg-slate-200 sm:block md:w-12" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function SummaryRow({ label, value, children }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/70 px-4 py-3">
      <div className="flex items-center gap-2.5">{children}<span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span></div>
      <span className="text-sm font-bold text-slate-800">{value}</span>
    </div>
  );
}