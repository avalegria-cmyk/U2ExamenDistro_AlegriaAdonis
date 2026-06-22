const express = require("express");
const cors = require("cors");
const config = require("./config/env");
const createDatabase = require("./config/database");
const logger = require("./config/logger");
const ProductRepository = require("./repositories/product.repository");
const TokenRepository = require("./repositories/token.repository");
const ProductService = require("./services/product.service");
const AuthService = require("./services/auth.service");
const GoogleAuthAdapter = require("./adapters/google-auth.adapter");
const ProductController = require("./controllers/product.controller");
const AuthController = require("./controllers/auth.controller");
const createAuthMiddleware = require("./middlewares/auth.middleware");
const createErrorHandler = require("./middlewares/error.middleware");
const createAuthRoutes = require("./routes/auth.routes");
const createProductRoutes = require("./routes/product.routes");
const { NotFoundError } = require("./errors/app.error");

// Construye la aplicación con sus dependencias.
async function createApp() {
  const app = express();
  const database = await createDatabase(config.database);
  const productRepository = new ProductRepository(database);
  const tokenRepository = new TokenRepository(database);
  const authProvider = new GoogleAuthAdapter(config.googleClientId);
  const productService = new ProductService(productRepository, logger);
  const authService = new AuthService(config, authProvider, tokenRepository, logger);
  const productController = new ProductController(productService);
  const authController = new AuthController(authService);
  const requireAuth = createAuthMiddleware(config.jwtSecret, tokenRepository, logger);

  app.use(cors({ origin: config.frontendUrl }));
  app.use(express.json());
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api/auth", createAuthRoutes(authController, requireAuth));
  app.use("/api/products", createProductRoutes(productController, requireAuth));
  app.use((req, res, next) => next(new NotFoundError("Ruta no encontrada.")));
  app.use(createErrorHandler(logger));
  return app;
}

module.exports = createApp;
