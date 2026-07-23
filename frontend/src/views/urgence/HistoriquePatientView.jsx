import { useState } from 'react';
import LegacyCard from '../../components/ui/LegacyCard.jsx';
import PriorityBadge from '../../components/queue/PriorityBadge.jsx';
import StatusMessage from '../../components/ui/StatusMessage.jsx';
import { getHistoriqueUrgencesPatient } from '../../services/urgenceService.js';

export default function HistoriquePatientView() {
  const [patientIdInput, setPatientIdInput] = useState('');
  const [historique, setHistorique] = useState([]);
  const [searchedId, setSearchedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!patientIdInput.trim()) return;

    setLoading(true);
    setError(null);
    setSearchedId(patientIdInput);

    try {
      const response = await getHistoriqueUrgencesPatient(patientIdInput);
      if (response.success) {
        setHistorique(response.data || []);
      } else {
        setError(response.message || 'Erreur lors de la récupération.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Impossible de contacter le serveur.'
      );
      setHistorique([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <LegacyCard
        title="Historique des Urgences Patient"
        description="Consultez l'historique complet des évaluations et des constantes vitales d'un patient."
      >
        {/* Formulaire de recherche par ID Patient */}
        <form onSubmit={handleSearch} className="flex gap-4 mb-6 max-w-md">
          <input
            type="number"
            placeholder="Entrer l'ID du patient (ex: 12)"
            value={patientIdInput}
            onChange={(e) => setPatientIdInput(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>

        {/* Retours visuels */}
        {loading && <StatusMessage variant="loading" message="Chargement de l'historique..." />}
        {error && <StatusMessage variant="error" message={error} />}

        {/* Résultats */}
        {!loading && !error && searchedId && (
          <div>
            <p className="text-sm text-gray-600 mb-4 font-semibold">
              Historique trouvé pour le patient #{searchedId} : {historique.length} entrée(s)
            </p>

            {historique.length === 0 ? (
              <p className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                Aucune déclaration d&apos;urgence enregistrée pour ce patient.
              </p>
            ) : (
              <div className="queue-table-wrap">
                <table className="queue-table w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-3">Date & Heure</th>
                      <th className="p-3">Priorité</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">Pouls (bpm)</th>
                      <th className="p-3">Tension (mmHg)</th>
                      <th className="p-3">SpO₂ (%)</th>
                      <th className="p-3">Déclaré par</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historique.map((item) => (
                      <tr key={item.id_urgence} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          {new Date(item.date_declaration).toLocaleString('fr-FR')}
                        </td>
                        <td className="p-3">
                          <PriorityBadge level={item.niveau_priorite} />
                        </td>
                        <td className="p-3 font-semibold">
                          {item.score_gravite} / 4
                        </td>
                        <td className="p-3">{item.pouls}</td>
                        <td className="p-3">{item.tension_systolique}</td>
                        <td className="p-3">{item.saturation_o2}%</td>
                        <td className="p-3 text-sm text-gray-600">
                          {item.medecin_nom
                            ? `Dr. ${item.medecin_prenom} ${item.medecin_nom}`
                            : 'Système / Agent'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </LegacyCard>
    </div>
  );
}