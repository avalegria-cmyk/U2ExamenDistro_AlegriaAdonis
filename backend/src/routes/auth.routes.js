const express = require("express");

// Crea las rutas de autenticación.
function createAuthRoutes(authController, requireAuth) {
  const router = express.Router();
  router.post("/google", authController.login);
  router.post("/logout", requireAuth, authController.logout);
  return router;
}

module.exports = createAuthRoutes;
