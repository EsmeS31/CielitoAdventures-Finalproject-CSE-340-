export function notFound(req, res, next) {
  const error = new Error(`Page not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

export function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  const message =
    status === 500 ? "Something went wrong. Please try again soon." : error.message;

  console.error(error);
  res.status(status).render("error", {
    title: "Something went wrong",
    status,
    message
  });
}
