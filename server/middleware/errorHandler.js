export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500 ? "An unexpected server error occurred" : error.message,
    details: error.details || null,
  });
}

