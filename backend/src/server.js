const config = require("./config/env");
const createApp = require("./app");

// Inicia el servidor HTTP.
async function startServer() {
  config.validateEnvironment();
  const app = await createApp();
  app.listen(config.port, () => {
    console.log(`Servidor disponible en http://localhost:${config.port}`);
  });
}

startServer().catch((error) => {
  console.error(`No se pudo iniciar el servidor: ${error.message}`);
  process.exit(1);
});
