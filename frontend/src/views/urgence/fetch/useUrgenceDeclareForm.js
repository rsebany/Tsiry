import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { declarerUrgence } from '../../../services/urgenceService.js';
import { fetchMedecins } from '../../../services/rendezvousService.js';

export default function useUrgenceDeclareForm() {
  const [form, setForm] = useState({
    id_patient: '1',
    id_medecin: '',
    pouls: '',
    tension_systolique: '',
    saturation_o2: '',
  });
  const [medecins, setMedecins] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedecins()
      .then((data) => {
        if (Array.isArray(data)) setMedecins(data);
      })
      .catch(() => {});
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        id_patient: parseInt(form.id_patient, 10),
        pouls: parseInt(form.pouls, 10),
        tension_systolique: parseInt(form.tension_systolique, 10),
        saturation_o2: parseInt(form.saturation_o2, 10),
      };
      if (form.id_medecin) {
        payload.id_medecin = parseInt(form.id_medecin, 10);
      }

      const response = await declarerUrgence(payload);
      setResult(response.data);
      if (response.alerte) {
        toast.error(`Alerte ${response.data.niveau_priorite}`, { duration: 5000 });
      } else {
        toast.success('Cas enregistré');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la déclaration');
    } finally {
      setLoading(false);
    }
  }

  return { form, medecins, result, loading, handleChange, handleSubmit };
}
