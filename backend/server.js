require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ticketRoutes = require('./src/routes/ticketRoutes');
const rendezvousRoutes = require('./src/routes/rendezvousRoutes');

const app = express();

// 1. Middlewares de base obligatoires
app.use(cors());
app.use(express.json());

// 2. Middleware de debug PLACÉ AVANT LES ROUTES (pour intercepter et afficher CHAQUE requête)
app.use((req, res, next) => {
    console.log(`[DEBUG REQUÊTE] : ${req.method} ${req.url}`);
    next();
});

// 3. Route de vérification de santé
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: "system-gestion-hospitaliere-api — ok (Prêt)"
    });
});

// 4. Enregistrement unique des routes de l'équipe
app.use('/api/tickets', ticketRoutes);
app.use('/api/rendezvous', rendezvousRoutes); 

const PORT = process.env.PORT || 3001; 

app.listen(PORT, '127.0.0.1', () => {
    console.log(`Serveur démarré et écoute sur http://127.0.0.1:${PORT}`);
});