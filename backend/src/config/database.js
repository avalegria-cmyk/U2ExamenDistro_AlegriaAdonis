const { Pool } = require("pg");

// Conecta y prepara las tablas de la aplicación.
async function createDatabase(config) {
  const pool = new Pool({
    host: config.host,
    port: config.port,
    database: config.name,
    user: config.user,
    password: config.password
  });

  await pool.query("SELECT 1 FROM products LIMIT 1");
  await pool.query(`
    CREATE SEQUENCE IF NOT EXISTS products_product_id_seq;
    SELECT setval('products_product_id_seq', COALESCE((SELECT MAX(product_id) FROM products), 0) + 1, false);
    ALTER TABLE products ALTER COLUMN product_id SET DEFAULT nextval('products_product_id_seq');

    CREATE TABLE IF NOT EXISTS product_purchases (
      purchase_id BIGSERIAL PRIMARY KEY,
      product_id SMALLINT NOT NULL REFERENCES products(product_id),
      user_email VARCHAR(255) NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      total NUMERIC(12, 2) NOT NULL,
      purchased_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS revoked_tokens (
      jti VARCHAR(255) PRIMARY KEY,
      expires_at BIGINT NOT NULL
    );
  `);
  return pool;
}

module.exports = createDatabase;
