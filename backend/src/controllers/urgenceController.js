const CasUrgence = require('../models/CasUrgence');
const Ticket = require('../models/ticket');
const Hopital = require('../models/Hopital');

async function declarerUrgence(req, res, next) {
  try {
    const { id_patient, id_ticket, pouls, tension_systolique, saturation_o2, id_medecin } = req.body;

    if (!id_patient || pouls == null || tension_systolique == null || saturation_o2 == null) {
      const err = new Error('Champs requis : id_patient, pouls, tension_systolique, saturation_o2');
      err.status = 400;
      throw err;
    }

    const patientIdParsed = parseInt(id_patient, 10);
    const ticketIdParsed = id_ticket ? parseInt(id_ticket, 10) : null;

    // 1. Rattachement du patient au ticket anonyme si nécessaire via le modèle Ticket
    if (ticketIdParsed) {
      await Ticket.associatePatientIfNull(ticketIdParsed, patientIdParsed);
    }

    // 2. Recherche du ticket actif via le modèle Ticket
    const ticketActif = await Ticket.findActiveTicketByPatient(patientIdParsed);

    if (!ticketActif) {
      const err = new Error(
        "Déclaration refusée : aucun ticket actif (EN_ATTENTE ou EN_CONSULTATION) n'a été trouvé pour ce patient aujourd'hui."
      );
      err.status = 400;
      throw err;
    }

    // 3. Création du cas d'urgence via le modèle CasUrgence
    const cas = await CasUrgence.create({
      id_patient: patientIdParsed,
      pouls: parseInt(pouls, 10),
      tension_systolique: parseInt(tension_systolique, 10),
      saturation_o2: parseInt(saturation_o2, 10),
      id_medecin: id_medecin ? parseInt(id_medecin, 10) : null,
    });

    // 4. Calcul de la nouvelle position via le modèle Ticket
    const nouvellePosition = await Ticket.calculateQueuePosition(
      ticketActif.id_file,
      ticketActif.id_ticket
    );

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
        id_ticket: ticketActif.id_ticket,
        numero_ticket: ticketActif.numero,
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