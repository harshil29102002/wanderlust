const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/utils");
const {validateReview} = require("../middleware")
const { isusrLoggedin, isAuthor } = require("../middleware");
const reviewController = require("../controller/review");

// Review Route
// post request
router.post(
  "/",
  isusrLoggedin,
  validateReview,
  wrapAsync(reviewController.Addreview)
);

// delete Review Route
router.delete(
  "/:reviewId",
  isAuthor,
  isusrLoggedin,
  wrapAsync(reviewController.destroyreview)
);

module.exports = router;
