const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");



let port = 8080;

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
.then(() => {
    console.log("connected to DB");
})
.catch( ( err ) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine" ,"ejs");
app.set("views" , path.join(__dirname , "views") );
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride('_method')); 
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/" , ( req , res ) =>{
    res.send("hii , im rooooot ");
})

//index route 
app.get("/listings" , async ( req , res ) => {
    const allListings = await Listing.find({});
    // render expects the view name relative to the `views` directory, without leading slash or extension
    res.render("listings/index.ejs" , { allListings });
})

//new route 
app.get("/listings/new" , ( req , res ) => {
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id" , async ( req , res ) => {
    let {id } = req.params;
    const listing = await Listing.findById(id); 
    res.render("listings/show.ejs" , {listing});
})

app.post("/listings" , async ( req , res ) => {
    const newlisting = new Listing(req.body.listing) ;
   await newlisting.save();
    // console.log(listing);
res.redirect("/listings");
});

// edit route
app.get("/listings/:id/edit" ,async ( req , res ) =>{
    let {id } = req.params;
    const listing = await Listing.findById(id); 
     console.log("Listing data:", listing);
    console.log("Image data:", listing.image);
    res.render("listings/edit.ejs" , {listing});

});

// update route
app.put("/listings/:id" , async ( req , res ) =>{
    let {id } = req.params;
     await Listing.findByIdAndUpdate(id , {...req.body.listing});
     res.redirect(`/listings/${id}`); 

});

// delete route
app.delete("/listings/:id" , async ( req , res ) =>{
    let {id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing:", deletedListing);

     res.redirect("/listings");
    });



// app.get("/testlisting" , async ( req , res ) =>{
//     let sampleListings = new Listing( {
//         title : "MY New Home",
//         description : "By the Beach",
//         price : 1200,
//         location : "Indore",
//         country : "India",
//     });

//     await sampleListings.save();
//     console.log(" sample was saved");
//     res.send("successful testing");
    
// });

app.listen(port , () =>{
    console.log(` port is listening at ${port}`);

} )