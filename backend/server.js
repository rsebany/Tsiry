/*require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middlewares/errorHandler');
const rendezvousRoutes = require('./src/routes/rendezvousRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de base
app.use(express.json());
app.use(cors());

// Routes UC3
app.use(rendezvousRoutes);

// Route de vérification du serveur
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'system-gestion-hospitaliere-api' });
});

// Gestionnaire d'erreurs global (en dernier, une seule fois)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});*/
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ticketRoutes = require('./src/routes/ticketRoutes');

const app = express();

// Middlewares obligatoires
app.use(cors());
app.use(express.json()); // Indispensable pour lire le req.body des formulaires

// Route de vérification de santé (ajustée pour le proxy Vite /api/health)
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: "system-gestion-hospitaliere-api — ok (Prêt)"
    });
});

// Enregistrement des routes de l'équipe
app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});