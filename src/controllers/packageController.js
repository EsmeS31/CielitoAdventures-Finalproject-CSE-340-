import { validationResult } from "express-validator";
import {
  createDestination,
  createPackage,
  deleteDestination,
  deletePackage,
  getDestinationById,
  getPackageById,
  getPackageReviews,
  listAllPackages,
  listDestinations,
  listPublicPackages,
  updateDestination,
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

function destinationFormData(body = {}) {
  return {
    name: body.name ?? "",
    region: body.region ?? "",
    description: body.description ?? "",
    imageUrl: body.imageUrl ?? ""
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

export async function renderAdminDestinations(req, res, next) {
  try {
    const destinations = await listDestinations();
    res.render("admin/destinations/index", { title: "Admin Destinations", destinations });
  } catch (error) {
    next(error);
  }
}

export function renderNewDestination(req, res) {
  res.render("admin/destinations/form", {
    title: "New Destination",
    formData: destinationFormData(),
    errors: [],
    action: "/admin/destinations",
    submitLabel: "Create Destination"
  });
}

export async function createAdminDestination(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/destinations/form", {
      title: "New Destination",
      formData: destinationFormData(req.body),
      errors: errors.array(),
      action: "/admin/destinations",
      submitLabel: "Create Destination"
    });
  }

  try {
    await createDestination(destinationFormData(req.body));
    req.session.flash = { type: "success", message: "Destination created." };
    return res.redirect("/admin/destinations");
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).render("admin/destinations/form", {
        title: "New Destination",
        formData: destinationFormData(req.body),
        errors: [{ msg: "A destination with that name and region already exists." }],
        action: "/admin/destinations",
        submitLabel: "Create Destination"
      });
    }

    return next(error);
  }
}

export async function renderEditDestination(req, res, next) {
  try {
    const destination = await getDestinationById(req.params.id);

    if (!destination) {
      const error = new Error("Destination not found.");
      error.status = 404;
      throw error;
    }

    res.render("admin/destinations/form", {
      title: "Edit Destination",
      formData: {
        name: destination.name,
        region: destination.region,
        description: destination.description,
        imageUrl: destination.image_url ?? ""
      },
      errors: [],
      action: `/admin/destinations/${destination.id}`,
      submitLabel: "Save Destination"
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminDestination(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/destinations/form", {
      title: "Edit Destination",
      formData: destinationFormData(req.body),
      errors: errors.array(),
      action: `/admin/destinations/${req.params.id}`,
      submitLabel: "Save Destination"
    });
  }

  try {
    const destination = await updateDestination(req.params.id, destinationFormData(req.body));

    if (!destination) {
      const error = new Error("Destination not found.");
      error.status = 404;
      throw error;
    }

    req.session.flash = { type: "success", message: "Destination updated." };
    return res.redirect("/admin/destinations");
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).render("admin/destinations/form", {
        title: "Edit Destination",
        formData: destinationFormData(req.body),
        errors: [{ msg: "A destination with that name and region already exists." }],
        action: `/admin/destinations/${req.params.id}`,
        submitLabel: "Save Destination"
      });
    }

    return next(error);
  }
}

export async function deleteAdminDestination(req, res, next) {
  try {
    await deleteDestination(req.params.id);
    req.session.flash = { type: "success", message: "Destination deleted. Related packages are now unassigned." };
    return res.redirect("/admin/destinations");
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
