// Crea el controlador central de errores.
function createErrorHandler(logger) {
  return function errorHandler(error, req, res, next) {
    if (res.headersSent) return next(error);
    logger.error(error.message, {
      event: "ERROR",
      code: error.code || "INTERNAL_ERROR",
      method: req.method,
      path: req.originalUrl
    });
  res.status(error.status || 500).json({
      code: error.code || "INTERNAL_ERROR",
      message: error.status ? error.message : "Error interno del servidor."
  });
  };
}

module.exports = createErrorHandler;
