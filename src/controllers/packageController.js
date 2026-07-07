import { validationResult } from "express-validator";
import {
  createPackage,
  deletePackage,
  getPackageById,
  getPackageReviews,
  listAllPackages,
  listDestinations,
  listPublicPackages,
  updatePackage
} from "../models/packageModel.js";
import { createBooking } from "../models/bookingModel.js";
import { createReview } from "../models/reviewModel.js";

function packageFormData(body = {}) {
  return {
    destinationId: body.destinationId ?? "",
    title: body.title ?? "",
    category: body.category ?? "",
    durationDays: body.durationDays ?? "",
    price: body.price ?? "",
    description: body.description ?? "",
    status: body.status ?? "draft"
  };
}

export async function renderPackageList(req, res, next) {
  try {
    const packages = await listPublicPackages(req.query);
    res.render("packages/index", {
      title: "Packages",
      packages,
      filters: req.query
    });
  } catch (error) {
    next(error);
  }
}

export async function renderPackageDetail(req, res, next) {
  try {
    const selectedPackage = await getPackageById(req.params.id);

    if (!selectedPackage || selectedPackage.status !== "active") {
      const error = new Error("Package not found.");
      error.status = 404;
      throw error;
    }

    const reviews = await getPackageReviews(req.params.id);
    res.render("packages/detail", {
      title: selectedPackage.title,
      selectedPackage,
      reviews,
      errors: []
    });
  } catch (error) {
    next(error);
  }
}

export async function requestBooking(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.session.flash = { type: "error", message: errors.array()[0].msg };
    return res.redirect(`/packages/${req.params.id}`);
  }

  try {
    await createBooking({
      userId: req.session.user.id,
      packageId: req.params.id,
      travelDate: req.body.travelDate,
      partySize: req.body.partySize
    });
    req.session.flash = { type: "success", message: "Your booking request was submitted." };
    return res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
}

export async function submitReview(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.session.flash = { type: "error", message: errors.array()[0].msg };
    return res.redirect(`/packages/${req.params.id}`);
  }

  try {
    await createReview({
      userId: req.session.user.id,
      packageId: req.params.id,
      rating: req.body.rating,
      comment: req.body.comment
    });
    req.session.flash = { type: "success", message: "Your review was saved." };
    return res.redirect(`/packages/${req.params.id}`);
  } catch (error) {
    next(error);
  }
}

export async function renderAdminPackages(req, res, next) {
  try {
    const packages = await listAllPackages();
    res.render("admin/packages/index", { title: "Admin Packages", packages });
  } catch (error) {
    next(error);
  }
}

export async function renderNewPackage(req, res, next) {
  try {
    const destinations = await listDestinations();
    res.render("admin/packages/form", {
      title: "New Package",
      destinations,
      formData: packageFormData(),
      errors: [],
      action: "/admin/packages",
      submitLabel: "Create Package"
    });
  } catch (error) {
    next(error);
  }
}

export async function createAdminPackage(req, res, next) {
  const errors = validationResult(req);

  try {
    const destinations = await listDestinations();

    if (!errors.isEmpty()) {
      return res.status(422).render("admin/packages/form", {
        title: "New Package",
        destinations,
        formData: packageFormData(req.body),
        errors: errors.array(),
        action: "/admin/packages",
        submitLabel: "Create Package"
      });
    }

    await createPackage(packageFormData(req.body), req.session.user.id);
    req.session.flash = { type: "success", message: "Package created." };
    return res.redirect("/admin/packages");
  } catch (error) {
    next(error);
  }
}

export async function renderEditPackage(req, res, next) {
  try {
    const [selectedPackage, destinations] = await Promise.all([
      getPackageById(req.params.id),
      listDestinations()
    ]);

    if (!selectedPackage) {
      const error = new Error("Package not found.");
      error.status = 404;
      throw error;
    }

    res.render("admin/packages/form", {
      title: "Edit Package",
      destinations,
      formData: {
        destinationId: selectedPackage.destination_id ?? "",
        title: selectedPackage.title,
        category: selectedPackage.category,
        durationDays: selectedPackage.duration_days,
        price: selectedPackage.price,
        description: selectedPackage.description,
        status: selectedPackage.status
      },
      errors: [],
      action: `/admin/packages/${selectedPackage.id}`,
      submitLabel: "Save Package"
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminPackage(req, res, next) {
  const errors = validationResult(req);

  try {
    const destinations = await listDestinations();

    if (!errors.isEmpty()) {
      return res.status(422).render("admin/packages/form", {
        title: "Edit Package",
        destinations,
        formData: packageFormData(req.body),
        errors: errors.array(),
        action: `/admin/packages/${req.params.id}`,
        submitLabel: "Save Package"
      });
    }

    await updatePackage(req.params.id, packageFormData(req.body));
    req.session.flash = { type: "success", message: "Package updated." };
    return res.redirect("/admin/packages");
  } catch (error) {
    next(error);
  }
}

export async function deleteAdminPackage(req, res, next) {
  try {
    await deletePackage(req.params.id);
    req.session.flash = { type: "success", message: "Package deleted." };
    return res.redirect("/admin/packages");
  } catch (error) {
    next(error);
  }
}
