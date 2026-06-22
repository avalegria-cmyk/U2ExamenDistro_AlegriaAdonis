class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  // Inicia sesión con la credencial de Google.
  login = async (req, res, next) => {
    try {
      const result = await this.authService.loginWithGoogle(req.body.credential);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  // Invalida el JWT de la sesión.
  logout = async (req, res, next) => {
    try {
      await this.authService.logout(req.user);
      res.json({ message: "Sesión cerrada correctamente." });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AuthController;
