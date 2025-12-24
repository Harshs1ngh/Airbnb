const Listing = require("../models/Listing");




module.exports.index =  async (req, res) => {
  const { category, sort } = req.query;

  let filter = {};

  // category filter (array-safe)
  if (category) {
    filter.category = { $in: [category] };
  }

  let query = Listing.find(filter);

  // ✅ PRICE SORT ONLY
  if (sort === "price_asc") {
    query = query.sort({ price: 1 });
  } else if (sort === "price_desc") {
    query = query.sort({ price: -1 });
  } else {
    query = query.sort({ createdAt: -1 }); // default
  }

  const allListings = await query;

  res.render("listings/index", {
    allListings,
    category,
    sort
  });
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showrouts = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews", populate:{
        path: "author",
    },
})
    .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist !");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./listings/show.ejs", { listing });
};

module.exports.CreateRouts = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    if (!req.body.listing.image) {
        req.body.listing.image = {
            filename: "listingimage",
            url: "https://img.freepik.com/free-photo/beautiful-luxury-outdoor-swimming-pool-hotel-resort_74190-7433.jpg"
        };
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};
module.exports.EditRouts = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist !");
        return res.redirect("/listings");
    }
    let originalImageurl = listing.image.url;
    originalImageurl = originalImageurl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing ,originalImageurl });
};

module.exports.updateRouts = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    listing.set(req.body.listing);
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    await listing.save();
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteRouts = async (req, res, next) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};