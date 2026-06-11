require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'system-gestion-hospitaliere-api' });
});

const rendezvousRoutes = require('./src/routes/rendezvousRoutes');
app.use(rendezvousRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
