const Review = require("../models/review");
const Listing = require("../models/Listing");



module.exports.CreateReviews = async (req,res,next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New revies created!");
    res.redirect(`/listings/${listing._id}`);

    // console.log(req.body);
};

module.exports.deleteReviews = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};