const RendezVous = require('../models/RendezVous');
const PDFDocument = require('pdfkit');
const Utilisateur = require('../models/Utilisateur');

async function bookAppointment(req, res, next) {
  try {
    let { id_patient, id_medecin, date_heure, motif } = req.body;

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

async function listPatientAppointments(req, res, next) {
  try {
    const idPatient = parseInt(req.params.id, 10);
    if (Number.isNaN(idPatient)) {
      const err = new Error("Format d'identifiant patient invalide.");
      err.status = 400;
      throw err;
    }

    if (req.user?.role === 'PATIENT' && req.user.id !== idPatient) {
      const err = new Error('Accès non autorisé à ces rendez-vous.');
      err.status = 403;
      throw err;
    }

    // Récupération du filtre de requête (ex: ?filter=upcoming, ?filter=past ou ?filter=all)
    const { filter } = req.query;

    const rendezvous = await RendezVous.findByPatient(idPatient, filter);
    res.status(200).json(rendezvous);
  } catch (err) {
    next(err);
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

    // Vérification des autorisations
    if (req.user?.role === 'PATIENT' && req.user.id !== idPatient) {
      const err = new Error('Accès non autorisé à cet historique.');
      err.status = 403;
      throw err;
    }

    // 1. Récupération des données depuis PostgreSQL
    const rendezvous = await RendezVous.findByPatient(idPatient);
    
    // (Optionnel) Récupération des infos du patient si disponible
    let patientInfo = null;
    if (Utilisateur && typeof Utilisateur.findById === 'function') {
      patientInfo = await Utilisateur.findById(idPatient);
    }

    // 2. Configuration des en-têtes HTTP pour le téléchargement PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=historique_rdv_patient_${idPatient}.pdf`
    );

    // 3. Initialisation du document PDFKit
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Stream direct vers la réponse HTTP
    doc.pipe(res);

    // --- EN-TÊTE DU DOCUMENT ---
    doc
      .fillColor('#1E3A8A') // Bleu institutionnel
      .fontSize(20)
      .text('Système de Gestion Hospitalière', { align: 'center' })
      .moveDown(0.3);

    doc
      .fillColor('#4B5563')
      .fontSize(14)
      .text('Historique des Rendez-Vous Médicaux', { align: 'center' })
      .moveDown(1.5);

    // --- INFORMATIONS PATIENT ---
    doc.fillColor('#000000').fontSize(10);
    doc.text(`Identifiant Patient : #${idPatient}`);
    if (patientInfo) {
      doc.text(`Nom / Prénom : ${patientInfo.nom || ''} ${patientInfo.prenom || ''}`);
      doc.text(`Email : ${patientInfo.email || ''}`);
    }
    doc.text(`Date d'émission : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`);
    doc.moveDown(1);

    // Ligne de séparation
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#E5E7EB').stroke();
    doc.moveDown(1);

    // --- TABLEAU DES RENDEZ-VOUS ---
    if (!rendezvous || rendezvous.length === 0) {
      doc.fontSize(12).text('Aucun rendez-vous enregistré pour ce patient.', { align: 'center' });
    } else {
      // En-têtes des colonnes
      const tableTop = doc.y;
      doc.fontSize(10).fillColor('#111827');
      doc.text('Date & Heure', 50, tableTop, { width: 110 });
      doc.text('Médecin', 160, tableTop, { width: 140 });
      doc.text('Motif', 300, tableTop, { width: 140 });
      doc.text('Statut', 440, tableTop, { width: 100 });

      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#9CA3AF').stroke();
      doc.moveDown(0.5);

      // Parcours des rendez-vous
      doc.fontSize(9).fillColor('#374151');
      rendezvous.forEach((rdv) => {
        // Sauts de page automatiques si on atteint le bas
        if (doc.y > 720) {
          doc.addPage();
        }

        const currentY = doc.y;
        const dateFormatted = new Date(rdv.date_heure).toLocaleString('fr-FR', {
          dateStyle: 'short',
          timeStyle: 'short',
        });
        const medecin = rdv.nom_medecin
          ? `Dr. ${rdv.nom_medecin} (${rdv.specialite || 'Général'})`
          : `Médecin #${rdv.id_medecin}`;
        const motif = rdv.motif || 'Consultation générale';
        const statut = rdv.statut || 'PLANIFIE';

        doc.text(dateFormatted, 50, currentY, { width: 105 });
        doc.text(medecin, 160, currentY, { width: 135 });
        doc.text(motif, 300, currentY, { width: 135 });
        doc.text(statut, 440, currentY, { width: 100 });

        doc.moveDown(0.8);
      });
    }

    // --- PIED DE PAGE ---
    doc
      .fontSize(8)
      .fillColor('#9CA3AF')
      .text(
        'Ce document est un récapitulatif officiel généré automatiquement. Pour toute modification, contactez le secrétariat.',
        50,
        760,
        { align: 'center', width: 495 }
      );

    // Finalisation du PDF
    doc.end();
  } catch (err) {
    next(err);
  }
}

async function sendAppointmentReminders(req, res, next) {
  try {
    // Permet de passer un intervalle personnalisé en heures (ex: { "hoursAhead": 48 }), sinon 24h par défaut
    const hoursAhead = parseInt(req.body.hoursAhead, 10) || 24;

    // 1. Récupérer les rendez-vous éligibles
    const upcomingAppointments = await RendezVous.findUpcomingForReminders(hoursAhead);

    if (upcomingAppointments.length === 0) {
      return res.status(200).json({
        message: 'Aucun rappel à envoyer pour le moment.',
        processedCount: 0,
        details: [],
      });
    }

    const processed = [];

    // 2. Traitement de chaque rendez-vous
    for (const rdv of upcomingAppointments) {
      const dateFormatted = new Date(rdv.date_heure).toLocaleString('fr-FR', {
        dateStyle: 'full',
        timeStyle: 'short',
      });

      // Simulation de l'envoi du message (Email / SMS)
      // Si tu intègres Nodemailer ou Twilio plus tard, c'est ici qu'il faut l'appeler !
      const emailContent = {
        to: rdv.email_patient,
        subject: 'Rappel : Votre rendez-vous médical à venir',
        body: `Bonjour ${rdv.prenom_patient} ${rdv.nom_patient},\n\n` +
              `Nous vous rappelons votre rendez-vous prévu le ${dateFormatted} ` +
              `avec le Dr. ${rdv.nom_medecin} (${rdv.specialite || 'Généraliste'}).\n\n` +
              `N'oubliez pas de vous présenter à l'accueil pour valider votre présence.\n` +
              `L'équipe médicale.`,
      };

      console.log(`[RAPPEL SIMULÉ ENVOYÉ] -> ${rdv.email_patient} (RDV #${rdv.id_rdv})`);

      // 3. Marquer en BDD pour éviter un double envoi
      await RendezVous.markReminderSent(rdv.id_rdv);

      processed.push({
        id_rdv: rdv.id_rdv,
        patient: `${rdv.prenom_patient} ${rdv.nom_patient}`,
        email: rdv.email_patient,
        date_heure: rdv.date_heure,
        status: 'SENT',
      });
    }

    // 4. Retourner le compte-rendu d'exécution
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
};
