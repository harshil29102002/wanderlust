const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/utils");
const { isusrLoggedin,isOwner,validateLisiting,} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudconsfig.js");
const upload = multer({storage});

// this is a router.route means whenever we have multiple routes then we use router.route for our code refactoring express will give a functionlity to add common route and related that route request is get and put post that will be work as our route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isusrLoggedin,
    upload.single("listings[image]"),
    validateLisiting,
    wrapAsync(listingController.createListing)
  );

// index route
// router.get("/", wrapAsync(listingController.index));

// new Route
router.get("/new", isusrLoggedin, listingController.newForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isusrLoggedin,
    isOwner,
    upload.single("listings[image]"),
    validateLisiting,
    wrapAsync(listingController.updateListing)
  )
  .delete(isusrLoggedin, isOwner, wrapAsync(listingController.destroyListing));

// show route
// router.get("/:id", wrapAsync(listingController.showListing));

// create Route
// router.post("/", isusrLoggedin, validateLisiting, wrapAsync(listingController.createListing));

// Edit Route
router.get(
  "/:id/edit",
  isusrLoggedin,
  isOwner,
  wrapAsync(listingController.editListing)
);

// update route
// router.put(
//   "/:id",
//   isusrLoggedin,
//   isOwner,
//   validateLisiting,
//   wrapAsync(listingController.updateListing)
// );

// delete route
// router.delete("/:id", isusrLoggedin, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
