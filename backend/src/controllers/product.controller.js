class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  // Lista o busca productos.
  getAll = async (req, res, next) => {
    try { res.json(await this.productService.getAll(req.query.search)); } catch (error) { next(error); }
  };

  // Obtiene un producto.
  getById = async (req, res, next) => {
    try { res.json(await this.productService.getById(req.params.id)); } catch (error) { next(error); }
  };

  // Registra un producto.
  create = async (req, res, next) => {
    try { res.status(201).json(await this.productService.create(req.body, req.user.email)); } catch (error) { next(error); }
  };

  // Modifica un producto.
  update = async (req, res, next) => {
    try { res.json(await this.productService.update(req.params.id, req.body, req.user.email)); } catch (error) { next(error); }
  };

  // Elimina un producto.
  delete = async (req, res, next) => {
    try {
      await this.productService.delete(req.params.id, req.user.email);
      res.status(204).send();
    } catch (error) { next(error); }
  };

  // Procesa una compra.
  purchase = async (req, res, next) => {
    try {
      res.status(201).json(await this.productService.purchase(req.params.id, req.body.quantity, req.user.email));
    } catch (error) { next(error); }
  };
}

module.exports = ProductController;
