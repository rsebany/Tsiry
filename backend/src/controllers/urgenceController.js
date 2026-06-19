const CasUrgence = require('../models/CasUrgence');
const Hopital = require('../models/Hopital');

async function declarerUrgence(req, res, next) {
  try {
    const { id_patient, pouls, tension_systolique, saturation_o2, id_medecin } = req.body;

    if (!id_patient || pouls == null || tension_systolique == null || saturation_o2 == null) {
      const err = new Error('Champs requis : id_patient, pouls, tension_systolique, saturation_o2');
      err.status = 400;
      throw err;
    }

    const cas = await CasUrgence.create({
      id_patient: parseInt(id_patient, 10),
      pouls: parseInt(pouls, 10),
      tension_systolique: parseInt(tension_systolique, 10),
      saturation_o2: parseInt(saturation_o2, 10),
      id_medecin: id_medecin ? parseInt(id_medecin, 10) : null,
    });

    const alerte = cas.niveau_priorite === 'ROUGE' || cas.niveau_priorite === 'ORANGE';

    res.status(201).json({
      success: true,
      message: alerte
        ? `Alerte ${cas.niveau_priorite} — prise en charge prioritaire requise`
        : 'Cas enregistré',
      data: cas,
      alerte,
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
  getHopitaux,
};
