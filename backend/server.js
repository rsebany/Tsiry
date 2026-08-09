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
const ticketRoutes = require('./src/routes/ticketRoutes');
const urgenceRoutes = require('./src/routes/urgenceRoutes');
const authRoutes = require('./src/routes/authRoutes');
app.use(authRoutes);
app.use(rendezvousRoutes);
app.use(ticketRoutes);
app.use(urgenceRoutes);

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}

module.exports = app;
