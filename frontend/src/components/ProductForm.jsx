import { useEffect, useState } from "react";

const emptyForm = { ProductName: "", UnitPrice: "", UnitsInStock: "", Discontinued: false };

// Captura los datos de un producto.
function ProductForm({ selectedProduct, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  // Carga el producto seleccionado.
  useEffect(() => {
    setForm(selectedProduct ? { ...selectedProduct, Discontinued: Boolean(selectedProduct.Discontinued) } : emptyForm);
  }, [selectedProduct]);

  // Actualiza un campo del formulario.
  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  // Envía los datos del producto.
  async function handleSubmit(event) {
    event.preventDefault();
    const saved = await onSave(form);
    if (saved && !selectedProduct) setForm(emptyForm);
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{selectedProduct ? "Editar producto" : "Nuevo producto"}</h2>
      <label htmlFor="ProductName">Nombre</label>
      <input id="ProductName" name="ProductName" value={form.ProductName} onChange={handleChange} maxLength="80" required />
      <label htmlFor="UnitPrice">Precio unitario</label>
      <input id="UnitPrice" name="UnitPrice" type="number" min="0" step="0.01" value={form.UnitPrice} onChange={handleChange} required />
      <label htmlFor="UnitsInStock">Unidades en stock</label>
      <input id="UnitsInStock" name="UnitsInStock" type="number" min="0" step="1" value={form.UnitsInStock} onChange={handleChange} required />
      <label className="checkbox-row">
        <input name="Discontinued" type="checkbox" checked={form.Discontinued} onChange={handleChange} />
        Producto descontinuado
      </label>
      <div className="form-actions">
        <button type="submit">{selectedProduct ? "Guardar cambios" : "Agregar producto"}</button>
        {selectedProduct && <button type="button" className="secondary" onClick={onCancel}>Cancelar</button>}
      </div>
    </form>
  );
}

export default ProductForm;

