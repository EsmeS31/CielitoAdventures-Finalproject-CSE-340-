import { getAdminOverview } from "../models/adminModel.js";
import { validationResult } from "express-validator";
import { listAllBookings, updateBookingStatus } from "../models/bookingModel.js";
import { listContactMessages, updateContactStatus } from "../models/contactModel.js";
import { deleteReview, listAllReviews, setReviewFlag } from "../models/reviewModel.js";
import { listUsers, updateUserRole } from "../models/userModel.js";

export async function renderDashboard(req, res, next) {
  try {
    const overview = await getAdminOverview();
    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      ...overview
    });
  } catch (error) {
    next(error);
  }
}

export async function renderUsers(req, res, next) {
  try {
    const users = await listUsers();
    res.render("admin/users", { title: "Admin Users", users });
  } catch (error) {
    next(error);
  }
}

export async function updateRole(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.session.flash = { type: "error", message: errors.array()[0].msg };
    return res.redirect("/admin/users");
  }

  try {
    await updateUserRole(req.params.id, req.body.role);
    req.session.flash = { type: "success", message: "User role updated." };
    return res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
}

export async function renderBookings(req, res, next) {
  try {
    const bookings = await listAllBookings();
    res.render("admin/bookings", { title: "Admin Bookings", bookings });
  } catch (error) {
    next(error);
  }
}

export async function updateBooking(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.session.flash = { type: "error", message: errors.array()[0].msg };
    return res.redirect("/admin/bookings");
  }

  try {
    await updateBookingStatus(
      req.params.id,
      req.body.status,
      req.body.note,
      req.session.user.id
    );
    req.session.flash = { type: "success", message: "Booking status updated." };
    return res.redirect("/admin/bookings");
  } catch (error) {
    next(error);
  }
}

export async function renderReviews(req, res, next) {
  try {
    const reviews = await listAllReviews();
    res.render("admin/reviews", { title: "Admin Reviews", reviews });
  } catch (error) {
    next(error);
  }
}

export async function flagReview(req, res, next) {
  try {
    await setReviewFlag(req.params.id, req.body.isFlagged === "true");
    req.session.flash = { type: "success", message: "Review moderation updated." };
    return res.redirect("/admin/reviews");
  } catch (error) {
    next(error);
  }
}

export async function removeReview(req, res, next) {
  try {
    await deleteReview(req.params.id);
    req.session.flash = { type: "success", message: "Review deleted." };
    return res.redirect("/admin/reviews");
  } catch (error) {
    next(error);
  }
}

export async function renderMessages(req, res, next) {
  try {
    const messages = await listContactMessages();
    res.render("admin/messages", { title: "Admin Messages", messages });
  } catch (error) {
    next(error);
  }
}

export async function updateMessage(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.session.flash = { type: "error", message: errors.array()[0].msg };
    return res.redirect("/admin/messages");
  }

  try {
    await updateContactStatus(req.params.id, req.body.status, req.body.responseNote);
    req.session.flash = { type: "success", message: "Message updated." };
    return res.redirect("/admin/messages");
  } catch (error) {
    next(error);
  }
}
