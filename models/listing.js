const mongoose = require("mongoose");
const review = require("./review.js");
const { string } = require("joi");
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
    geometry: {      
        lat: Number,
        lng: Number
    },
    country: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner:
{
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      category: {
  type: [String],
  enum: ["trending", "rooms", "iconiccities", "castels", "mountain", "pools", "camping", "farms", "arctic", "boat"],
  required: true
},
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await review.deleteMany({_id : { $in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
