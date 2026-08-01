import { useEffect, useState } from 'react';
import {
  bookAppointment,
  fetchMedecins,
  fetchPatients,
  fetchSpecialites,
} from '../../../services/rendezvousService.js';
import { INITIAL_FORM } from './bookAppointmentConstants.js';

export function validateSlot(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Veuillez saisir une date et une heure valides.';
  }
  if (date <= new Date()) {
    return 'Impossible de réserver un rendez-vous dans le passé.';
  }
  if (date.getDay() === 0) {
    return 'Les rendez-vous ne sont pas disponibles le dimanche.';
  }
  const heure = date.getHours();
  if (heure < 8 || heure >= 18) {
    return 'Les rendez-vous sont possibles uniquement entre 8h et 18h.';
  }
  return null;
}

export default function useBookAppointmentForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [specialites, setSpecialites] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    Promise.all([fetchSpecialites(), fetchPatients()])
      .then(([specs, pts]) => {
        setSpecialites(specs);
        setPatients(pts);
        if (pts.length === 1) {
          setForm((prev) => ({ ...prev, id_patient: String(pts[0].id_utilisateur) }));
        }
      })
      .catch((err) => {
        setInitError(err.response?.data?.error || err.message || 'Impossible de charger les données.');
      });
  }, []);

  useEffect(() => {
    if (!form.specialite) {
      setMedecins([]);
      setForm((prev) => ({ ...prev, id_medecin: '' }));
      return;
    }

    fetchMedecins(form.specialite)
      .then((data) => {
        setMedecins(data);
        setForm((prev) => ({ ...prev, id_medecin: '' }));
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message || 'Impossible de charger les médecins.');
      });
  }, [form.specialite]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const slotError = validateSlot(form.date_heure);
    if (slotError) {
      setError(slotError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      id_patient: Number(form.id_patient),
      id_medecin: Number(form.id_medecin),
      date_heure: new Date(form.date_heure).toISOString(),
      motif: form.motif || undefined,
    };

    try {
      const rdv = await bookAppointment(payload);
      setSuccess(rdv);
      setForm({
        ...INITIAL_FORM,
        ...(patients.length === 1 ? { id_patient: String(patients[0].id_utilisateur) } : {}),
      });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          'Une erreur est survenue lors de la réservation.'
      );
    } finally {
      setLoading(false);
    }
  }

  const isFormValid =
    form.id_patient &&
    form.specialite &&
    form.id_medecin &&
    form.date_heure &&
    !validateSlot(form.date_heure);

  return {
    form,
    specialites,
    medecins,
    patients,
    loading,
    success,
    error,
    initError,
    handleChange,
    handleSubmit,
    isFormValid,
  };
}
