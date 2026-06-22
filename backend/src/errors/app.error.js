class AppError extends Error {
  constructor(message, status = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404, "NOT_FOUND");
  }
}

class AuthenticationError extends AppError {
  constructor(message) {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

class StockError extends AppError {
  constructor(message) {
    super(message, 409, "INSUFFICIENT_STOCK");
  }
}

module.exports = { AppError, ValidationError, NotFoundError, AuthenticationError, StockError };

