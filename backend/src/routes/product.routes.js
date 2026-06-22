const express = require("express");

// Crea las rutas protegidas de productos.
function createProductRoutes(productController, requireAuth) {
  const router = express.Router();
  router.use(requireAuth);
  router.get("/", productController.getAll);
  router.get("/:id", productController.getById);
  router.post("/", productController.create);
  router.put("/:id", productController.update);
  router.delete("/:id", productController.delete);
  router.post("/:id/purchase", productController.purchase);
  return router;
}

module.exports = createProductRoutes;
