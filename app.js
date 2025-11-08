const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingschema } = require("./schema.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
.then(() =>{
    console.log("connected to DB");
})
.catch((err) => { 
    console.log(err); 
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/" , (req,res) => {
    res.send("hi i am a user");
});


const validateListing = (req,res,next) =>{
    let {error} = listingschema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errmsg);
    }else {
        next();
    }
};


// Index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
});


// New Route
app.get("/listings/new", (req,res) => {
    res.render("./listings/new.ejs");
});


// Show Route
app.get("/listings/:id" ,  wrapAsync (async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs" , {listing});
}));

//create route
app.post("/listings",validateListing, wrapAsync (async (req,res,next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));
    
// Edit route
app.get("/listings/:id/edit" ,  wrapAsync (async (req,res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id",
    validateListing,
    wrapAsync (async (req,res) => {
    let{ id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync ( async (req,res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));

// app.get("/testlisting", async (req,res) => {
//     let samplelisting = new Listing ({
//         title: "dubai hotel",
//         description: "in the capital",
//         price: 1200,
//         location: "europe",
//         country: "dubai",
//     });

//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.use((req,res,next)=>{
    next(new ExpressError(404 , "Page Not Found!"));
});

app.use((err,req,res,next) => {
    let { statusCode=505 , message="Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("this port is listening");
});