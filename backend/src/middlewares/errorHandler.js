function errorHandler(err, _req, res, _next) {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur',
  });
}

app.use((req, res, next) => {
    console.log(`[DEBUG REQUÊTE] : ${req.method} ${req.url}`);
    next();
});

module.exports = errorHandler;
