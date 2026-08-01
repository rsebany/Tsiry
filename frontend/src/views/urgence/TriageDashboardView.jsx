import { useEffect, useState, useCallback } from 'react';
import LegacyCard from '../../components/ui/LegacyCard.jsx';
import PriorityBadge from '../../components/queue/PriorityBadge.jsx';
import StatusMessage from '../../components/ui/StatusMessage.jsx';
import usePolling from '../../hooks/usePolling.js';
import { getTriageDashboard } from '../../services/urgenceService.js';

export default function TriageDashboardView() {
  const fetchDashboardData = useCallback(async () => {
    const res = await getTriageDashboard();
    if (!res.success) throw new Error('Impossible de charger le tableau de triage');
    return res.data;
  }, []);

  // Polling toutes les 10 secondes pour maintenir le tableau à jour
  const { data, error, loading } = usePolling(fetchDashboardData, 10000);

  const stats = data?.stats || {
    total_urgences: 0,
    count_rouge: 0,
    count_orange: 0,
    count_jaune: 0,
    count_vert: 0,
    score_moyen: 0,
  };

  const urgences = data?.urgences || [];

  return (
    <div className="space-y-6">
      <LegacyCard
        title="Tableau de bord de Triage & Urgences"
        description="Supervision en temps réel des cas d'urgence du jour (UC7/UC8 — Orneda)."
      >
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="p-4 bg-slate-100 rounded-lg text-center border">
            <p className="text-xs text-gray-500 font-semibold uppercase">Total Cas</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total_urgences}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg text-center border border-red-200">
            <p className="text-xs text-red-600 font-semibold uppercase">Rouge (Critiques)</p>
            <p className="text-2xl font-bold text-red-600">{stats.count_rouge}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg text-center border border-orange-200">
            <p className="text-xs text-orange-600 font-semibold uppercase">Orange</p>
            <p className="text-2xl font-bold text-orange-600">{stats.count_orange}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg text-center border border-yellow-200">
            <p className="text-xs text-yellow-600 font-semibold uppercase">Jaune</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.count_jaune}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center border border-green-200">
            <p className="text-xs text-green-600 font-semibold uppercase">Vert</p>
            <p className="text-2xl font-bold text-green-600">{stats.count_vert}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg text-center border border-blue-200">
            <p className="text-xs text-blue-600 font-semibold uppercase">Score Moyen</p>
            <p className="text-2xl font-bold text-blue-600">{stats.score_moyen} / 4</p>
          </div>
        </div>

        {/* Etat de chargement / erreur */}
        {loading && !data && <StatusMessage variant="loading" message="Chargement des cas d'urgence…" />}
        {error && <StatusMessage variant="error" message={error} />}

        {/* Tableau ordonné (File ROUGE en tout premier) */}
        {!loading && urgences.length === 0 ? (
          <p className="text-center py-6 text-gray-500">Aucun cas d&apos;urgence enregistré aujourd&apos;hui.</p>
        ) : (
          <div className="queue-table-wrap">
            <table className="queue-table w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3">Priorité</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">N° Ticket</th>
                  <th className="p-3">Pouls (bpm)</th>
                  <th className="p-3">Tension (mmHg)</th>
                  <th className="p-3">SpO₂ (%)</th>
                  <th className="p-3">Heure</th>
                  <th className="p-3">Statut Ticket</th>
                </tr>
              </thead>
              <tbody>
                {urgences.map((u) => {
                  const isRouge = u.niveau_priorite === 'ROUGE';
                  return (
                    <tr
                      key={u.id_urgence}
                      className={`border-b ${
                        isRouge ? 'bg-red-50/60 font-medium' : ''
                      }`}
                    >
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <PriorityBadge level={u.niveau_priorite} />
                          {isRouge && (
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        {u.patient_prenom} {u.patient_nom} (ID: #{u.id_patient})
                      </td>
                      <td className="p-3">
                        {u.numero_ticket ? `#${u.numero_ticket}` : '—'}
                      </td>
                      <td className="p-3">{u.pouls}</td>
                      <td className="p-3">{u.tension_systolique}</td>
                      <td className="p-3">{u.saturation_o2}%</td>
                      <td className="p-3">
                        {new Date(u.date_declaration).toLocaleTimeString('fr-FR')}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 text-xs rounded bg-gray-200">
                          {u.statut_ticket || 'Sans ticket'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </LegacyCard>
    </div>
  );
}