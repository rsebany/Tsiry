const pool = require('../config/db');

const Ticket = {
    getTicketStatus: async (id_ticket) => {
        const ticketResult = await pool.query(
            'SELECT * FROM t_ticket WHERE id_ticket = $1',
            [id_ticket]
        );

        if (ticketResult.rows.length === 0) {
            return null;
        }

        const ticket = ticketResult.rows[0];

        const positionResult = await pool.query(
            `SELECT COUNT(*) AS personnes_avant FROM t_ticket
             WHERE id_file = $1 
             AND statut = 'EN_ATTENTE' 
             AND heure_creation < $2`,
            [ticket.id_file, ticket.heure_creation]
        );

        const personnes_avant = parseInt(positionResult.rows[0].personnes_avant);
        const estimation = personnes_avant * 5;

        return {
            id_ticket: ticket.id_ticket,
            numero: ticket.numero,
            statut: ticket.statut,
            personnes_avant,
            estimation_minutes: estimation,
            message: `Votre position : N°${personnes_avant + 1}. Estimation de passage : ${estimation} min`
        };
    }
};

module.exports = Ticket;
