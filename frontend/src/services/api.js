const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Envía una petición autenticada a la API.
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "No se pudo completar la petición.");
  return data;
}

