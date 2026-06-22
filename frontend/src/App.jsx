import { useEffect, useState } from "react";
import Login from "./components/Login";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import { apiRequest } from "./services/api";

// Coordina la autenticación y el CRUD.
function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  // Carga productos al iniciar sesión.
  useEffect(() => {
    if (user) loadProducts();
  }, [user]);

  // Consulta los productos protegidos.
  async function loadProducts(searchValue = search) {
    try {
      const query = searchValue ? `?search=${encodeURIComponent(searchValue)}` : "";
      setProducts(await apiRequest(`/products${query}`));
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  // Ejecuta la búsqueda de productos.
  function searchProducts(event) {
    event.preventDefault();
    loadProducts(search);
  }

  // Crea o actualiza un producto.
  async function saveProduct(form) {
    try {
      const path = selectedProduct ? `/products/${selectedProduct.ProductID}` : "/products";
      const method = selectedProduct ? "PUT" : "POST";
      await apiRequest(path, { method, body: JSON.stringify(form) });
      setMessage(selectedProduct ? "Producto actualizado." : "Producto creado.");
      setSelectedProduct(null);
      await loadProducts();
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  }

  // Elimina un producto confirmado.
  async function deleteProduct(id) {
    if (!window.confirm("¿Deseas eliminar este producto?")) return;
    try {
      await apiRequest(`/products/${id}`, { method: "DELETE" });
      setMessage("Producto eliminado.");
      await loadProducts();
    } catch (error) {
      handleError(error);
    }
  }

  // Solicita y procesa una compra.
  async function purchaseProduct(product) {
    const value = window.prompt(`Cantidad de ${product.ProductName} que deseas comprar:`);
    if (value === null) return;
    try {
      const purchase = await apiRequest(`/products/${product.ProductID}/purchase`, {
        method: "POST",
        body: JSON.stringify({ quantity: Number(value) })
      });
      setMessage(`Compra registrada. Total: $${purchase.Total.toFixed(2)}. Stock restante: ${purchase.RemainingStock}.`);
      await loadProducts();
    } catch (error) {
      handleError(error);
    }
  }

  // Cierra y revoca la sesión.
  async function logout() {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch (error) {
      setMessage(error.message);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setProducts([]);
    }
  }

  // Muestra errores y limpia sesiones inválidas.
  function handleError(error) {
    if (error.message.includes("Token")) logout();
    setMessage(error.message);
  }

  if (!user) return <><Login onLogin={setUser} onError={setMessage} />{message && <p className="floating-message">{message}</p>}</>;

  return (
    <main className="app-shell">
      <header>
        <div><p className="eyebrow">NORTHWIND</p><h1>Gestión de productos</h1></div>
        <div className="profile">
          {user.picture && <img src={user.picture} alt="Foto del usuario" referrerPolicy="no-referrer" />}
          <div><strong>{user.name}</strong><span>{user.email}</span></div>
          <button className="secondary" onClick={logout}>Cerrar sesión</button>
        </div>
      </header>
      {message && <p className="message" onClick={() => setMessage("")}>{message}</p>}
      <section className="workspace">
        <ProductForm selectedProduct={selectedProduct} onSave={saveProduct} onCancel={() => setSelectedProduct(null)} />
        <section className="products-panel">
          <div className="section-heading"><h2>Productos</h2><span>{products.length} registros</span></div>
          <form className="search-form" onSubmit={searchProducts}>
            <input aria-label="Buscar producto" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre" />
            <button type="submit">Buscar</button>
            <button type="button" className="secondary" onClick={() => { setSearch(""); loadProducts(""); }}>Limpiar</button>
          </form>
          <ProductList products={products} onEdit={setSelectedProduct} onDelete={deleteProduct} onPurchase={purchaseProduct} />
        </section>
      </section>
    </main>
  );
}

export default App;
