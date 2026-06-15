require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middlewares/errorHandler');
const ticketRoutes = require('./src/routes/ticketRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'system-gestion-hospitaliere-api' });
});

app.use('/api', ticketRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
