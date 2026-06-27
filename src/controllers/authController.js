import { validationResult } from "express-validator";
import { createUser, findUserByEmail, verifyPassword } from "../models/userModel.js";

function sessionUser(user) {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    role: user.role
  };
}

export function renderRegister(req, res) {
  res.render("auth/register", {
    title: "Create Account",
    formData: {},
    errors: []
  });
}

export async function register(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/register", {
      title: "Create Account",
      formData: req.body,
      errors: errors.array()
    });
  }

  try {
    const user = await createUser(req.body);
    req.session.user = sessionUser(user);
    req.session.flash = { type: "success", message: "Welcome to Cielito Adventures." };
    return res.redirect(user.role === "traveler" ? "/dashboard" : "/admin");
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).render("auth/register", {
        title: "Create Account",
        formData: req.body,
        errors: [{ msg: "An account with that email already exists.", path: "email" }]
      });
    }

    return next(error);
  }
}

export function renderLogin(req, res) {
  res.render("auth/login", {
    title: "Login",
    formData: {},
    errors: []
  });
}

export async function login(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      title: "Login",
      formData: req.body,
      errors: errors.array()
    });
  }

  try {
    const user = await findUserByEmail(req.body.email);
    const validPassword = user && (await verifyPassword(req.body.password, user.password_hash));

    if (!validPassword) {
      return res.status(401).render("auth/login", {
        title: "Login",
        formData: req.body,
        errors: [{ msg: "Email or password is incorrect." }]
      });
    }

    req.session.regenerate((error) => {
      if (error) return next(error);

      req.session.user = sessionUser(user);
      req.session.flash = { type: "success", message: "You are logged in." };
      return res.redirect(user.role === "traveler" ? "/dashboard" : "/admin");
    });
  } catch (error) {
    next(error);
  }
}

export function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie("cielito.sid");
    return res.redirect("/");
  });
}
