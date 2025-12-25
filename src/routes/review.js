const express = require("express");
const Review = require("../models/review.js");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/Listing.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const newReview = require("../controllers/reviews.js");

// reviews

//post route
router.post("/" ,isLoggedIn, validateReview,
     wrapAsync(newReview.CreateReviews));

// Delete Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
     wrapAsync(newReview.deleteReviews));

module.exports = router;