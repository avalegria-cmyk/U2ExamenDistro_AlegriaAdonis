class ProductRepository {
  constructor(database) {
    this.database = database;
  }

  // Convierte una fila al formato de la API.
  map(row) {
    if (!row) return null;
    return {
      ProductID: row.product_id,
      ProductName: row.product_name,
      UnitPrice: Number(row.unit_price || 0),
      UnitsInStock: row.units_in_stock || 0,
      Discontinued: row.discontinued
    };
  }

  // Lista productos por nombre.
  async findAll(search = "") {
    const result = await this.database.query(`
      SELECT product_id, product_name, unit_price, units_in_stock, discontinued
      FROM products WHERE product_name ILIKE $1 ORDER BY product_id DESC
    `, [`%${search}%`]);
    return result.rows.map((row) => this.map(row));
  }

  // Busca un producto por identificador.
  async findById(id, client = this.database) {
    const result = await client.query(`
      SELECT product_id, product_name, unit_price, units_in_stock, discontinued
      FROM products WHERE product_id = $1
    `, [id]);
    return this.map(result.rows[0]);
  }

  // Inserta un producto.
  async create(product) {
    const result = await this.database.query(`
      INSERT INTO products (product_name, unit_price, units_in_stock, discontinued)
      VALUES ($1, $2, $3, $4)
      RETURNING product_id, product_name, unit_price, units_in_stock, discontinued
    `, [product.ProductName, product.UnitPrice, product.UnitsInStock, product.Discontinued]);
    return this.map(result.rows[0]);
  }

  // Actualiza un producto.
  async update(id, product) {
    const result = await this.database.query(`
      UPDATE products SET product_name = $1, unit_price = $2,
      units_in_stock = $3, discontinued = $4 WHERE product_id = $5
      RETURNING product_id, product_name, unit_price, units_in_stock, discontinued
    `, [product.ProductName, product.UnitPrice, product.UnitsInStock, product.Discontinued, id]);
    return this.map(result.rows[0]);
  }

  // Elimina un producto sin movimientos.
  async delete(id) {
    const result = await this.database.query("DELETE FROM products WHERE product_id = $1", [id]);
    return result.rowCount > 0;
  }

  // Ejecuta una compra en una transacción.
  async purchase(id, quantity, userEmail) {
    const client = await this.database.connect();
    try {
      await client.query("BEGIN");
      const result = await client.query(`
        SELECT product_id, product_name, unit_price, units_in_stock, discontinued
        FROM products WHERE product_id = $1 FOR UPDATE
      `, [id]);
      const product = result.rows[0];
      if (!product) {
        await client.query("ROLLBACK");
        return { error: "NOT_FOUND" };
      }
      if (product.discontinued || product.units_in_stock < quantity) {
        await client.query("ROLLBACK");
        return { error: "STOCK" };
      }

      await client.query("UPDATE products SET units_in_stock = units_in_stock - $1 WHERE product_id = $2", [quantity, id]);
      const total = Number((Number(product.unit_price) * quantity).toFixed(2));
      const purchase = await client.query(`
        INSERT INTO product_purchases (product_id, user_email, quantity, total)
        VALUES ($1, $2, $3, $4)
        RETURNING purchase_id, purchased_at
      `, [id, userEmail, quantity, total]);
      await client.query("COMMIT");
      return {
        PurchaseID: Number(purchase.rows[0].purchase_id),
        ProductID: Number(id),
        ProductName: product.product_name,
        Quantity: quantity,
        Total: total,
        PurchasedAt: purchase.rows[0].purchased_at.toISOString(),
        RemainingStock: product.units_in_stock - quantity
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = ProductRepository;
