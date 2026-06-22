// Presenta los productos y sus acciones.
function ProductList({ products, onEdit, onDelete, onPurchase }) {
  if (!products.length) return <p className="empty">No se encontraron productos.</p>;

  return (
    <div className="product-list">
      {products.map((product) => (
        <article className={`product-card ${product.Discontinued ? "discontinued" : ""}`} key={product.ProductID}>
          <div className="product-info">
            <span className="status">{product.Discontinued ? "Descontinuado" : "Disponible"}</span>
            <h3>{product.ProductName}</h3>
            <p>Precio: ${Number(product.UnitPrice).toFixed(2)}</p>
            <p>Stock: {product.UnitsInStock} unidades</p>
          </div>
          <div className="product-actions">
            <button disabled={product.Discontinued || product.UnitsInStock === 0} onClick={() => onPurchase(product)}>Comprar</button>
            <button className="secondary" onClick={() => onEdit(product)}>Editar</button>
            <button className="danger" onClick={() => onDelete(product.ProductID)}>Eliminar</button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ProductList;

