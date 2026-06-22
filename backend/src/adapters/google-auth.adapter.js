const { OAuth2Client } = require("google-auth-library");
const { AuthenticationError, ValidationError } = require("../errors/app.error");

class GoogleAuthAdapter {
  constructor(clientId) {
    this.clientId = clientId;
    this.client = new OAuth2Client(clientId);
  }

  // Adapta la respuesta de Google al usuario local.
  async verify(credential) {
    if (!credential) throw new ValidationError("No se recibió la credencial de Google.");

    try {
      const ticket = await this.client.verifyIdToken({
        idToken: credential,
        audience: this.clientId
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email_verified) throw new AuthenticationError("Cuenta de Google no válida.");
      return { id: payload.sub, name: payload.name, email: payload.email, picture: payload.picture };
    } catch (error) {
      if (error.status) throw error;
      throw new AuthenticationError("No se pudo validar la cuenta de Google.");
    }
  }
}

module.exports = GoogleAuthAdapter;

