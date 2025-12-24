const express = require("express");
const router = express.Router();
const multer = require('multer');
const Listing = require("../models/Listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const {storage} = require("../cloudConfig.js"); 
const upload = multer({storage});

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, 
        upload.single("listing[image]"),
        validateListing,
     wrapAsync(listingController.CreateRouts)
    );

// New Route
router.get("/new", 
    isLoggedIn, listingController.renderNewForm);

router.get("/trending",async (req,res) => {
    res.render("filters/trending.ejs");
});


router
    .route("/:id")
    .get(wrapAsync(listingController.showrouts))
    .put(isLoggedIn, isOwner,
        upload.single("listing[image]"),
        validateListing,
    wrapAsync(listingController.updateRouts))
    .delete(isLoggedIn, isOwner, 
    wrapAsync(listingController.deleteRouts));

// Show Route
// router.get("/:id", 
//     wrapAsync(listingController.showrouts));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, 
    wrapAsync(listingController.EditRouts));

//update route
// router.put("/:id", isLoggedIn, isOwner, validateListing, 
//     wrapAsync(listingController.updateRouts));

//delete route
// router.delete("/:id", isLoggedIn, isOwner, 
//     wrapAsync(listingController.deleteRouts));




module.exports = router;
