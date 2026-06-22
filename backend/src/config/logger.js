const fs = require("fs");
const path = require("path");
const winston = require("winston");

const logsDirectory = path.resolve(__dirname, "../../logs");
fs.mkdirSync(logsDirectory, { recursive: true });

// Oculta campos sensibles antes de registrar.
const sanitize = winston.format((info) => {
  delete info.token;
  delete info.credential;
  delete info.password;
  return info;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    sanitize(),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logsDirectory, "system.log") })
  ]
});

module.exports = logger;

