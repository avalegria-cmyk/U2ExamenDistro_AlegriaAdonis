const jwt = require("jsonwebtoken");

// Valida el JWT enviado por el cliente.
function createAuthMiddleware(jwtSecret, tokenRepository, logger) {
  return async (req, res, next) => {
    const authorization = req.headers.authorization || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null;

    if (!token) {
      logger.warn("Acceso sin token", { event: "UNAUTHORIZED_ACCESS", path: req.originalUrl });
      return res.status(401).json({ code: "AUTHENTICATION_ERROR", message: "Token requerido." });
    }

    try {
      req.user = jwt.verify(token, jwtSecret);
      if (await tokenRepository.isRevoked(req.user.jti)) {
        logger.warn("Acceso con token revocado", { event: "UNAUTHORIZED_ACCESS", path: req.originalUrl });
        return res.status(401).json({ code: "AUTHENTICATION_ERROR", message: "Token revocado." });
      }
      next();
    } catch (error) {
      if (error.code && error.code.startsWith("ECONN")) return next(error);
      logger.warn("Acceso con token inválido", { event: "UNAUTHORIZED_ACCESS", path: req.originalUrl });
      res.status(401).json({ code: "AUTHENTICATION_ERROR", message: "Token inválido o vencido." });
    }
  };
}

module.exports = createAuthMiddleware;
