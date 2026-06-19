import { useEffect, useState } from 'react';
import { bookAppointment, fetchMedecins, fetchSpecialites } from '@/services/rendezvousService';
import { INITIAL_FORM } from '@/views/rendezvous/fetch/bookAppointmentConstants';

export default function useBookAppointmentForm() {
  const [form, setForm] = useState({ ...INITIAL_FORM, id_patient: '' });
  const [specialites, setSpecialites] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    fetchSpecialites()
      .then(setSpecialites)
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
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      id_medecin: Number(form.id_medecin),
      date_heure: new Date(form.date_heure).toISOString(),
      motif: form.motif || undefined,
    };

    try {
      const rdv = await bookAppointment(payload);
      setSuccess(rdv);
      setForm({ ...INITIAL_FORM, id_patient: '' });
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || 'Une erreur est survenue lors de la réservation.'
      );
    } finally {
      setLoading(false);
    }
  }

  const isFormValid = form.specialite && form.id_medecin && form.date_heure;

  return {
    form,
    specialites,
    medecins,
    loading,
    success,
    error,
    initError,
    handleChange,
    handleSubmit,
    isFormValid,
  };
}
