const RendezVous = require('../models/RendezVous');
const PDFDocument = require('pdfkit');
const Utilisateur = require('../models/Utilisateur');
const db = require('../config/db'); // Ajout crucial pour que listPatientAppointments fonctionne

async function bookAppointment(req, res, next) {
  try {
    const { id_medecin, date_heure, motif } = req.body;

    // 1. Vérification du format et validité de la date
    const appointmentDate = new Date(date_heure);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ error: 'Format de date/heure invalide.' });
    }

    // 2. Blocage des rendez-vous dans le passé
    const now = new Date();
    if (appointmentDate <= now) {
      return res.status(400).json({
        error: 'Impossible de réserver un rendez-vous dans le passé.',
      });
    }

    // 3. Règles horaires : pas le dimanche, uniquement heures ouvrables (8h-18h)
    if (appointmentDate.getDay() === 0) {
      return res.status(400).json({
        error: 'Les rendez-vous ne sont pas disponibles le dimanche.',
      });
    }

    const heure = appointmentDate.getHours();
    if (heure < 8 || heure >= 18) {
      return res.status(400).json({
        error: 'Les rendez-vous sont possibles uniquement entre 8h et 18h.',
      });
    }

    let { id_patient } = req.body;

    if (req.user?.role === 'PATIENT') {
      id_patient = req.user.id;
    }

    if (!id_patient || !id_medecin || !date_heure) {
      const err = new Error('Les champs id_patient, id_medecin et date_heure sont obligatoires.');
      err.status = 400;
      throw err;
    }

    const conflict = await RendezVous.findConflict(id_medecin, date_heure);
    if (conflict) {
      const err = new Error('Ce créneau est déjà réservé pour ce médecin.');
      err.status = 409;
      throw err;
    }

    const rdv = await RendezVous.create({ id_patient, id_medecin, date_heure, motif });
    res.status(201).json(rdv);
  } catch (err) {
    next(err);
  }
}

async function searchTodayAppointments(req, res, next) {
  try {
    const { nom, telephone } = req.query;
    if (!nom && !telephone) {
      const err = new Error('Fournissez au moins un nom ou un numéro de téléphone.');
      err.status = 400;
      throw err;
    }

    const results = await RendezVous.searchTodayByPatient({ nom, telephone });
    res.status(200).json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
}

async function listPatientAppointments(req, res, next) {
  try {
    const { id } = req.params;
    const { filter = 'all', page = 1, limit = 10 } = req.query;

    const idPatient = parseInt(id, 10);
    if (Number.isNaN(idPatient)) {
      const err = new Error("Format d'identifiant patient invalide.");
      err.status = 400;
      throw err;
    }

    if (req.user?.role === 'PATIENT' && req.user.id !== idPatient) {
      const err = new Error('Accès non autorisé à cet historique.');
      err.status = 403;
      throw err;
    }

    // 1. Assainissement et conversion des paramètres de pagination
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const offset = (parsedPage - 1) * parsedLimit;

    // 2. Construction dynamique de la clause WHERE selon le filtre
    let filterCondition = '';
    if (filter === 'upcoming') {
      filterCondition = 'AND date_heure >= NOW()';
    } else if (filter === 'past') {
      filterCondition = 'AND date_heure < NOW()';
    }

    // 3. Requête SQL de comptage total (pour les métadonnées de pagination)
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM t_rendez_vous 
      WHERE id_patient = $1 ${filterCondition};
    `;
    const countResult = await db.query(countQuery, [idPatient]);
    const totalItems = parseInt(countResult.rows[0].total, 10);

    // 4. Requête SQL principale avec LIMIT et OFFSET
    const sqlQuery = `
      SELECT r.*, m.nom AS medecin_nom, m.prenom AS medecin_prenom, m.specialite
      FROM t_rendez_vous r
      JOIN t_utilisateur m ON r.id_medecin = m.id_utilisateur
      WHERE r.id_patient = $1 ${filterCondition}
      ORDER BY r.date_heure DESC
      LIMIT $2 OFFSET $3;
    `;

    const { rows } = await db.query(sqlQuery, [idPatient, parsedLimit, offset]);

    // 5. Réponse structurée avec données et métadonnées
    return res.status(200).json({
      data: rows,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / parsedLimit),
        currentPage: parsedPage,
        limit: parsedLimit,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function exportPatientAppointmentsPDF(req, res, next) {
  try {
    const idPatient = parseInt(req.params.id, 10);
    if (Number.isNaN(idPatient)) {
      const err = new Error("Format d'identifiant patient invalide.");
      err.status = 400;
      throw err;
    }

    if (req.user?.role === 'PATIENT' && req.user.id !== idPatient) {
      const err = new Error('Accès non autorisé à cet historique.');
      err.status = 403;
      throw err;
    }

    const rendezvous = await RendezVous.findByPatient(idPatient);
    
    let patientInfo = null;
    if (Utilisateur && typeof Utilisateur.findById === 'function') {
      patientInfo = await Utilisateur.findById(idPatient);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=historique_rdv_patient_${idPatient}.pdf`
    );

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.pipe(res);

    doc.fillColor('#1E3A8A').fontSize(20).text('Système de Gestion Hospitalière', { align: 'center' }).moveDown(0.3);
    doc.fillColor('#4B5563').fontSize(14).text('Historique des Rendez-Vous Médicaux', { align: 'center' }).moveDown(1.5);

    doc.fillColor('#000000').fontSize(10);
    doc.text(`Identifiant Patient : #${idPatient}`);
    if (patientInfo) {
      doc.text(`Nom / Prénom : ${patientInfo.nom || ''} ${patientInfo.prenom || ''}`);
      doc.text(`Email : ${patientInfo.email || ''}`);
    }
    doc.text(`Date d'émission : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`);
    doc.moveDown(1);

    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#E5E7EB').stroke();
    doc.moveDown(1);

    if (!rendezvous || rendezvous.length === 0) {
      doc.fontSize(12).text('Aucun rendez-vous enregistré pour ce patient.', { align: 'center' });
    } else {
      const tableTop = doc.y;
      doc.fontSize(10).fillColor('#111827');
      doc.text('Date & Heure', 50, tableTop, { width: 110 });
      doc.text('Médecin', 160, tableTop, { width: 140 });
      doc.text('Motif', 300, tableTop, { width: 140 });
      doc.text('Statut', 440, tableTop, { width: 100 });

      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#9CA3AF').stroke();
      doc.moveDown(0.5);

      doc.fontSize(9).fillColor('#374151');
      rendezvous.forEach((rdv) => {
        if (doc.y > 720) {
          doc.addPage();
        }

        const currentY = doc.y;
        const dateFormatted = new Date(rdv.date_heure).toLocaleString('fr-FR', {
          dateStyle: 'short',
          timeStyle: 'short',
        });
        const medecin = rdv.nom_medecin ? `Dr. ${rdv.nom_medecin} (${rdv.specialite || 'Général'})` : `Médecin #${rdv.id_medecin}`;
        const motif = rdv.motif || 'Consultation générale';
        const statut = rdv.statut || 'PLANIFIE';

        doc.text(dateFormatted, 50, currentY, { width: 105 });
        doc.text(medecin, 160, currentY, { width: 135 });
        doc.text(motif, 300, currentY, { width: 135 });
        doc.text(statut, 440, currentY, { width: 100 });
        doc.moveDown(0.8);
      });
    }

    doc.fontSize(8).fillColor('#9CA3AF').text(
      'Ce document est un récapitulatif officiel généré automatiquement. Pour toute modification, contactez le secrétariat.',
      50, 760, { align: 'center', width: 495 }
    );

    doc.end();
  } catch (err) {
    next(err);
  }
}

async function sendAppointmentReminders(req, res, next) {
  try {
    const hoursAhead = parseInt(req.body.hoursAhead, 10) || 24;
    const upcomingAppointments = await RendezVous.findUpcomingForReminders(hoursAhead);

    if (upcomingAppointments.length === 0) {
      return res.status(200).json({
        message: 'Aucun rappel à envoyer pour le moment.',
        processedCount: 0,
        details: [],
      });
    }

    const processed = [];

    for (const rdv of upcomingAppointments) {
      const dateFormatted = new Date(rdv.date_heure).toLocaleString('fr-FR', {
        dateStyle: 'full',
        timeStyle: 'short',
      });

      console.log(`[RAPPEL SIMULÉ ENVOYÉ] -> ${rdv.email_patient} (RDV #${rdv.id_rdv})`);

      await RendezVous.markReminderSent(rdv.id_rdv);

      processed.push({
        id_rdv: rdv.id_rdv,
        patient: `${rdv.prenom_patient} ${rdv.nom_patient}`,
        email: rdv.email_patient,
        date_heure: rdv.date_heure,
        status: 'SENT',
      });
    }

    return res.status(200).json({
      message: `${processed.length} rappel(s) traité(s) et envoyé(s) avec succès.`,
      processedCount: processed.length,
      details: processed,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  bookAppointment,
  listPatientAppointments,
  exportPatientAppointmentsPDF,
  sendAppointmentReminders,
  searchTodayAppointments,
};