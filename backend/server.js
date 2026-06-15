require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middlewares/errorHandler');
// 1. IMPORTATION des routes du patient
const patientRoutes = require('./src/routes/patientRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'system-gestion-hospitaliere-api' });
});

// 2. ENREGISTREMENT des routes avec leur préfixe global pour route
app.use('/api/patients', patientRoutes);

// Le errorHandler doit TOUJOURS être le dernier app.use
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
