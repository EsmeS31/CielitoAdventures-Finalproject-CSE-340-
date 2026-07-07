import { validationResult } from "express-validator";
import { createContactMessage } from "../models/contactModel.js";

export function renderContact(req, res) {
  res.render("contact", {
    title: "Contact",
    formData: {
      name: req.session.user ? `${req.session.user.firstName} ${req.session.user.lastName}` : "",
      email: req.session.user?.email ?? "",
      subject: "",
      message: ""
    },
    errors: []
  });
}

export async function submitContact(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("contact", {
      title: "Contact",
      formData: req.body,
      errors: errors.array()
    });
  }

  try {
    await createContactMessage({
      userId: req.session.user?.id,
      ...req.body
    });
    req.session.flash = { type: "success", message: "Your message was sent." };
    return res.redirect("/contact");
  } catch (error) {
    next(error);
  }
}
