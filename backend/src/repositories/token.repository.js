class TokenRepository {
  constructor(database) {
    this.database = database;
  }

  // Guarda un token revocado hasta su expiración.
  async revoke(jti, expiration) {
    await this.database.query(`
      INSERT INTO revoked_tokens (jti, expires_at) VALUES ($1, $2)
      ON CONFLICT (jti) DO UPDATE SET expires_at = EXCLUDED.expires_at
    `, [jti, expiration]);
    await this.removeExpired();
  }

  // Comprueba si un token fue revocado.
  async isRevoked(jti) {
    await this.removeExpired();
    const result = await this.database.query("SELECT jti FROM revoked_tokens WHERE jti = $1", [jti]);
    return result.rowCount > 0;
  }

  // Elimina revocaciones vencidas.
  async removeExpired() {
    const now = Math.floor(Date.now() / 1000);
    await this.database.query("DELETE FROM revoked_tokens WHERE expires_at <= $1", [now]);
  }
}

module.exports = TokenRepository;
