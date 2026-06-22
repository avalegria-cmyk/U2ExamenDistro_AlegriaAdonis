require("dotenv").config();

const required = ["GOOGLE_CLIENT_ID", "JWT_SECRET"];

// Comprueba las variables obligatorias.
function validateEnvironment() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Faltan variables de entorno: ${missing.join(", ")}`);
  }
}

module.exports = {
  port: Number(process.env.PORT) || 3000,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "2h",
  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || "northwind",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres"
  },
  validateEnvironment
};
