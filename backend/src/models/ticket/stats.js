const pool = require('../../config/db');

async function getDailyStats(id_file) {
  const [statuts, heures, attente, service] = await Promise.all([
    pool.query(
      `SELECT statut, COUNT(*)::int AS total
       FROM t_ticket WHERE id_file = $1
       GROUP BY statut`,
      [id_file]
    ),
    pool.query(
      `SELECT EXTRACT(HOUR FROM heure_creation)::int AS heure, COUNT(*)::int AS total
       FROM t_ticket WHERE id_file = $1
       GROUP BY heure ORDER BY heure`,
      [id_file]
    ),
    pool.query(
      `SELECT ROUND(AVG(EXTRACT(EPOCH FROM (heure_appel - heure_creation)) / 60)::numeric, 1) AS moyenne
       FROM t_ticket WHERE id_file = $1 AND heure_appel IS NOT NULL`,
      [id_file]
    ),
    pool.query(
      `SELECT ROUND(AVG(EXTRACT(EPOCH FROM (heure_cloture - heure_appel)) / 60)::numeric, 1) AS moyenne
       FROM t_ticket WHERE id_file = $1 AND heure_cloture IS NOT NULL`,
      [id_file]
    ),
  ]);

  const par_statut = {};
  for (const row of statuts.rows) par_statut[row.statut] = row.total;

  return {
    total_tickets: Object.values(par_statut).reduce((acc, n) => acc + n, 0),
    par_statut,
    par_heure: heures.rows.map((row) => ({ heure: row.heure, total: row.total })),
    temps_attente_moyen_min: attente.rows[0].moyenne !== null ? parseFloat(attente.rows[0].moyenne) : null,
    temps_service_moyen_min: service.rows[0].moyenne !== null ? parseFloat(service.rows[0].moyenne) : null,
  };
}

module.exports = { getDailyStats };
