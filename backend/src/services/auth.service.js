const { randomUUID } = require("crypto");
const jwt = require("jsonwebtoken");

class AuthService {
  constructor(config, authProvider, tokenRepository, logger) {
    this.config = config;
    this.authProvider = authProvider;
    this.tokenRepository = tokenRepository;
    this.logger = logger;
  }

  // Verifica Google y entrega un JWT propio.
  async loginWithGoogle(credential) {
    const user = await this.authProvider.verify(credential);
    const token = jwt.sign(user, this.config.jwtSecret, {
      jwtid: randomUUID(),
      expiresIn: this.config.jwtExpiresIn
    });
    this.logger.info("Inicio de sesión correcto", { event: "LOGIN", userEmail: user.email });
    return { token, user };
  }

  // Revoca el JWT de la sesión.
  async logout(user) {
    await this.tokenRepository.revoke(user.jti, user.exp);
    this.logger.info("Cierre de sesión correcto", { event: "LOGOUT", userEmail: user.email });
  }
}

module.exports = AuthService;
