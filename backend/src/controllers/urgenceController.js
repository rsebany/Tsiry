const CasUrgence = require('../models/CasUrgence');
const Ticket = require('../models/ticket');
const Hopital = require('../models/Hopital');

// Patient anonyme utilisé par défaut quand un ticket n'est lié à aucun patient.
const ANONYMOUS_PATIENT_ID = 1;

// Toute la logique métier (association anonyme, triage, replacé) est déléguée
// aux nœuds de modèle. Le contrôleur se limite à l'échange HTTP.
async function declarerUrgence(req, res, next) {
  try {
    const { id_ticket, pouls, tension_systolique, saturation_o2, id_medecin } = req.body;

    // 1. Validation des champs — l'identité patient n'est jamais envoyée.
    if (
      id_ticket == null ||
      pouls == null ||
      tension_systolique == null ||
      saturation_o2 == null
    ) {
      const err = new Error('Champs requis : id_ticket, pouls, tension_systolique, saturation_o2');
      err.status = 400;
      throw err;
    }

    const ticketIdParsed = parseInt(id_ticket, 10);
    if (Number.isNaN(ticketIdParsed) || ticketIdParsed <= 0) {
      const err = new Error('Identifiant de ticket invalide');
      err.status = 400;
      throw err;
    }

    const poulsParsed = parseInt(pouls, 10);
    const tensionParsed = parseInt(tension_systolique, 10);
    const saturationParsed = parseInt(saturation_o2, 10);
    if ([poulsParsed, tensionParsed, saturationParsed].some(Number.isNaN)) {
      const err = new Error('Pouls, tension et saturation doivent être numériques');
      err.status = 400;
      throw err;
    }

    // 2. Recherche du ticket — point d'entrée unique du triage.
    const ticket = await Ticket.findById(ticketIdParsed);
    if (!ticket) {
      const err = new Error('Déclaration refusée : aucun ticket ne correspond à cet identifiant.');
      err.status = 404;
      throw err;
    }

    // 3. Association automatique au patient anonyme si le ticket n'est pas lié.
    let idPatient = ticket.id_patient;
    if (!idPatient) {
      idPatient = ANONYMOUS_PATIENT_ID;
      await Ticket.associatePatientIfNull(ticket.id_ticket, idPatient);
    }

    // 4. Création du cas d'urgence — le niveau de priorité est calculé dans le modèle.
    const cas = await CasUrgence.create({
      id_patient: idPatient,
      pouls: poulsParsed,
      tension_systolique: tensionParsed,
      saturation_o2: saturationParsed,
      id_medecin: id_medecin ? parseInt(id_medecin, 10) : null,
    });

    // 5. Recalcul de la position du ticket dans sa file (priorités appliquées).
    const nouvellePosition = await Ticket.calculateQueuePosition(ticket.id_file, ticket.id_ticket);

    const alerte = cas.niveau_priorite === 'ROUGE' || cas.niveau_priorite === 'ORANGE';

    res.status(201).json({
      success: true,
      message: alerte
        ? `Alerte ${cas.niveau_priorite} — prise en charge prioritaire requise (Position : ${
            nouvellePosition ? `#${nouvellePosition}` : 'En consultation'
          })`
        : 'Cas enregistré',
      data: {
        ...cas,
        id_ticket: ticket.id_ticket,
        numero_ticket: ticket.numero,
        position_file: nouvellePosition,
      },
      alerte,
    });
  } catch (err) {
    next(err);
  }
}

async function getDernierCasPatient(req, res, next) {
  try {
    const { id } = req.params;
    const idPatientParsed = parseInt(id, 10);

    if (isNaN(idPatientParsed)) {
      const err = new Error('Identifiant patient invalide');
      err.status = 400;
      throw err;
    }

    const cas = await CasUrgence.findLatestByPatient(idPatientParsed);

    res.status(200).json({
      success: true,
      data: cas || null,
      message: cas
        ? 'Dernier cas d\'urgence récupéré avec succès'
        : 'Aucun cas d\'urgence enregistré aujourd\'hui pour ce patient',
    });
  } catch (err) {
    next(err);
  }
}

// Endpoint : Récupération de l'historique complet par patient
async function getHistoriquePatient(req, res, next) {
  try {
    const { id } = req.params;
    const idPatientParsed = parseInt(id, 10);

    if (isNaN(idPatientParsed)) {
      const err = new Error('Identifiant patient invalide');
      err.status = 400;
      throw err;
    }

    const historique = await CasUrgence.findAllByPatient(idPatientParsed);

    res.status(200).json({
      success: true,
      data: historique,
      count: historique.length,
    });
  } catch (err) {
    next(err);
  }
}

async function getTriageDashboard(req, res, next) {
  try {
    const dashboardData = await CasUrgence.getTriageDashboardData();
    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (err) {
    next(err);
  }
}

async function getHopitaux(req, res, next) {
  try {
    const hopitaux = await Hopital.findAll();
    res.status(200).json({ success: true, data: hopitaux });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  declarerUrgence,
  getDernierCasPatient,
  getHistoriquePatient,
  getTriageDashboard,
  getHopitaux,
};