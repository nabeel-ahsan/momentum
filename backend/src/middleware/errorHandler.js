const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "An unexpected error occurred!";
  let errors = err.errors || {};

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid format for field: ${err.path}`;
    errors = { [err.path]: `Invalid value '${err.value}'` };
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    errors = { [field]: `${field} is already taken.` };
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your token has expired. Please log in again.";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 403;
    message = "Invalid token. Please log in again.";
  }

  const isProduction = process.env.NODE_ENV === "production";

  const isOperational =
    err.isOperational ||
    err.name === "ValidationError" ||
    err.name === "CastError" ||
    err.code === 11000 ||
    err.name === "TokenExpiredError" ||
    err.name === "JsonWebTokenError";

  if (isProduction && !isOperational) {
    statusCode = 500;
    message = "Something went wrong on our end!";
    errors = {};
  }

  console.error(`[ERROR] ${req.method} ${req.originalUrl} - Status: ${statusCode} -      
  Message: ${message}`);

  if (err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
