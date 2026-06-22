const { ValidationError, NotFoundError, StockError } = require("../errors/app.error");

class ProductService {
  constructor(productRepository, logger) {
    this.productRepository = productRepository;
    this.logger = logger;
  }

  // Lista o busca productos.
  async getAll(search) {
    return this.productRepository.findAll(String(search || "").trim());
  }

  // Obtiene un producto existente.
  async getById(id) {
    const product = await this.productRepository.findById(this.validId(id));
    if (!product) throw new NotFoundError("Producto no encontrado.");
    return product;
  }

  // Crea un producto válido.
  async create(data, userEmail) {
    const product = await this.productRepository.create(this.validateProduct(data));
    this.logger.info("Producto creado", { event: "PRODUCT_CREATE", productId: product.ProductID, userEmail });
    return product;
  }

  // Actualiza un producto válido.
  async update(id, data, userEmail) {
    const product = await this.productRepository.update(this.validId(id), this.validateProduct(data));
    if (!product) throw new NotFoundError("Producto no encontrado.");
    this.logger.info("Producto actualizado", { event: "PRODUCT_UPDATE", productId: product.ProductID, userEmail });
    return product;
  }

  // Elimina un producto existente.
  async delete(id, userEmail) {
    const productId = this.validId(id);
    try {
      if (!await this.productRepository.delete(productId)) throw new NotFoundError("Producto no encontrado.");
    } catch (error) {
      if (error.code === "23503") {
        throw new ValidationError("No se puede eliminar un producto con compras registradas.");
      }
      throw error;
    }
    this.logger.info("Producto eliminado", { event: "PRODUCT_DELETE", productId, userEmail });
  }

  // Compra un producto con stock disponible.
  async purchase(id, quantity, userEmail) {
    const productId = this.validId(id);
    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      throw new ValidationError("La cantidad debe ser un entero mayor que cero.");
    }
    const purchase = await this.productRepository.purchase(productId, parsedQuantity, userEmail);
    if (purchase.error === "NOT_FOUND") throw new NotFoundError("Producto no encontrado.");
    if (purchase.error === "STOCK") throw new StockError("Producto descontinuado o stock insuficiente.");
    this.logger.info("Compra realizada", {
      event: "PURCHASE", productId, quantity: parsedQuantity, userEmail
    });
    return purchase;
  }

  // Valida los campos de un producto.
  validateProduct(data) {
    const product = {
      ProductName: String(data.ProductName || "").trim(),
      UnitPrice: Number(data.UnitPrice),
      UnitsInStock: Number(data.UnitsInStock),
      Discontinued: data.Discontinued ? 1 : 0
    };
    if (!product.ProductName) throw new ValidationError("El nombre es obligatorio.");
    if (!Number.isFinite(product.UnitPrice) || product.UnitPrice < 0) throw new ValidationError("El precio no es válido.");
    if (!Number.isInteger(product.UnitsInStock) || product.UnitsInStock < 0) throw new ValidationError("El stock no es válido.");
    return product;
  }

  // Valida un identificador numérico.
  validId(id) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) throw new ValidationError("Identificador no válido.");
    return parsedId;
  }
}

module.exports = ProductService;
