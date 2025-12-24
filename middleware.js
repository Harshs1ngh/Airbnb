const Listing = require("./models/Listing.js");
const Review = require("./models/review.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listings");
        return  res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}; 

module.exports.isOwner = async (req,res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.CurrUser._id)){
        req.flash("error","You are not the owner of this listing")
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {

    // ✅ FIX: normalize image BEFORE Joi runs
    if (
        req.body?.listing?.image === "" ||
        typeof req.body?.listing?.image === "string"
    ) {
        delete req.body.listing.image;
    }

    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }

    next();
};


module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errmsg);
    }else {
        next();
    }
};
 
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;   // ✅ FIX 1: correct param name
    let review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }
    if (!review.author.equals(res.locals.CurrUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
