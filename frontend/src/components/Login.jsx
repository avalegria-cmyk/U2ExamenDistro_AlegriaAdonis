import { useEffect, useRef } from "react";
import { apiRequest } from "../services/api";

// Muestra el acceso mediante Google.
function Login({ onLogin, onError }) {
  const buttonRef = useRef(null);

  // Configura el botón oficial de Google.
  useEffect(() => {
    let timer;
    const initializeGoogle = () => {
      if (!window.google || !buttonRef.current) {
        timer = setTimeout(initializeGoogle, 100);
        return;
      }
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular"
      });
    };
    initializeGoogle();
    return () => clearTimeout(timer);
  }, []);

  // Intercambia la credencial de Google por un JWT.
  async function handleGoogleResponse(response) {
    try {
      const data = await apiRequest("/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential: response.credential })
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (error) {
      onError(error.message);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="eyebrow">ACCESO SEGURO</p>
        <h1>Northwind Productos</h1>
        <p>Inicia sesión con tu cuenta de Google para administrar productos y realizar compras.</p>
        <div ref={buttonRef} className="google-button" />
      </section>
    </main>
  );
}

export default Login;
