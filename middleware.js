const Listing = require("./models/listing")
const Review = require("./models/review")
const ExpressError = require("./utils/ExpressError");
const {listingSchema , reviewSchema} = require("./schema.js")

module.exports.isusrLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "you must been Logged In to listings");
        return res.redirect("/login");
    }
    next()
}

module.exports.SaveUrlredirect = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner =  async (req,res,next)=>{
    let { id } = req.params;
    let listings = await Listing.findById(id);
    if(!listings.owner.equals(res.locals.currusr._id)){
        req.flash("error","you do not have permission to edit")
        return res.redirect(`/listings/${id}`)
      }
      console.log(res.locals.currusr._id)
      next()
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };


module.exports.isAuthor =  async (req,res,next)=>{
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currusr._id)){
        req.flash("error","you do not have permission to delete review")
        return res.redirect(`/listings/${id}`)
      }
      next()
}

module.exports.validateLisiting = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };
