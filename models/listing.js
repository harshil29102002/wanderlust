const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
// const MONGOURL = "mongodb://127.0.0.1:27017/wanderlust";

// Main()
//     .then((res) => {
//         console.log("welcome to MonGo world");
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// async function Main() {
//     await mongoose.connect(MONGOURL);
// }

const listingSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
    },
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

// Listing.findByIdAndDelete("668661fbb30e5016ebd30ddb",{new:true})
// .then((res)=>{
//     console.log(res)
// })
