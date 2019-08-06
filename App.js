//App.js
var express = require("express");
var app = express();

app.use(express.static("public"));

app.set("view engine","ejs");

//Home route
app.get("/",function(req,res){
     res.render("home");

});

// About route
app.get("/about",function(req,res){
    res.render("about");

});
// Route to Singly Linked List
app.get("/singlyList",function(req,res){
    res.render("singlyList");
});

// Route to Btree Visualizer
app.get("/BTree",function(req,res){
    res.render("BTree");
});

// Route unavailable
app.get("*",function(req,res){
    res.render("error");

});



app.listen(process.env.PORT,process.env.IP);