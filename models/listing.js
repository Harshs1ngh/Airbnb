const mongoose = require("mongoose");
const review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: { 
  type: mongoose.Schema.Types.Mixed,
  default: {
    filename: "listingimage",
    url: "https://img.freepik.com/free-photo/beautiful-luxury-outdoor-swimming-pool-hotel-resort_74190-7433.jpg",
  },
},
    price: Number,
    location: String,
    country: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await review.deleteMany({_id : { $in: listing.reviews}});
  }
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;