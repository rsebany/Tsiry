const Ticket = require('../models/Ticket');

const getTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Ticket.getTicketStatus(id);

        if (!result) {
            return res.status(404).json({
                success: false,
                data: null,
                message: 'Ticket introuvable'
            });
        }

        console.log(`[NOTIFICATION] Envoi au patient — ${result.message}`);

        return res.status(200).json({
            success: true,
            data: result,
            message: 'Statut récupéré avec succès'
        });

    } catch (error) {
        console.error('Erreur getTicketStatus :', error);
        return res.status(500).json({
            success: false,
            data: null,
            message: 'Erreur serveur'
        });
    }
};

module.exports = { getTicketStatus };
