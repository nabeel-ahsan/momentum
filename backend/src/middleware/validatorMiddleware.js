import AppError from "../utils/appError.js";

export const validatorMiddleware = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const errors = {};
    Object.keys(fieldErrors).forEach((key) => {
      errors[key] = fieldErrors[key].join(", ");
    });

    return next(new AppError("Validation failed", 400, errors));
  }
  req.body = result.data;
  next();
};