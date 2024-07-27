const Review = require("../models/review.js")
const Listing = require("../models/listing.js")

module.exports.Addreview = async (req, res) => {
    let listings = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);
    newReview.author = req.user._id  
    console.log(newReview)
    listings.reviews.push(newReview);

    await newReview.save();
    await listings.save();
    req.flash("success", "reiview is Added!");
    console.log("you enter the review");
    res.redirect(`/listings/${listings._id}`);
  }

  module.exports.destroyreview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "reiview is Deleted");
    res.redirect(`/listings/${id}`);
  }