const Listing = require("../models/listing.js"); 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index = async (req, res) => {
  let allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
};

module.exports.newForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listings = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  if (!listings) {
    req.flash("error", "listings you requested is doesn't exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listings });
};

module.exports.createListing = async (req, res, next) => {

   let response = await geocodingClient.forwardGeocode({
    query: req.body.listings.location,
    limit: 2
  })
    .send()
    
  let url = req.file.path;
  let filename = req.file.filename;
  let newLisiting = new Listing(req.body.listings);
  newLisiting.owner = req.user._id;
  newLisiting.image = { url, filename };
  newLisiting.geometry = response.body.features[0].geometry;
  let savedListings = await newLisiting.save();
  console.log(savedListings)
  req.flash("success", "new listings is added");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listings = await Listing.findById(id);
  if (!listings) {
    req.flash("error", "listings you requested is doesn't exist");
    res.redirect("/listings");
  }
  let oringinalUrl = listings.image.url
  oringinalUrl = oringinalUrl.replace("/upload","/upload/w_250") 
  res.render("listings/edit.ejs", { listings, oringinalUrl });
};

module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listings });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "listing is Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedlising = await Listing.findByIdAndDelete(id);
  console.log(deletedlising);
  req.flash("success", "listing is deleted!");
  res.redirect("/listings");
};
