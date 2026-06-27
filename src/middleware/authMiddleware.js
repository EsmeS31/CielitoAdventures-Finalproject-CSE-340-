export function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.session.flash = { type: "error", message: "Please log in to continue." };
    return res.redirect("/login");
  }

  return next();
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.session.user?.role;

    if (!role || !allowedRoles.includes(role)) {
      const error = new Error("You do not have permission to view that page.");
      error.status = 403;
      return next(error);
    }

    return next();
  };
}
