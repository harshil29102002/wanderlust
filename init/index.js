const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGOURL = "mongodb://127.0.0.1:27017/wanderlust";

Main()
  .then((res) => {
    console.log("welcome to MonGo world");
  })
  .catch((err) => {
    console.log(err);
  });

async function Main() {
  await mongoose.connect(MONGOURL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "669280b90fb89bfd7354a317",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was intilaized");
};

initDB();

// Listing.findByIdAndDelete("66858dbbcff8997150ab8a8f")
