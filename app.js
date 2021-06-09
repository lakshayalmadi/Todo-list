const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");

const app = express();

// var items =[];
// var workItems =[];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoDB code

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: 'Study DSA'
});

const item2 = new Item({
    name: 'Finish todo list'
});

const defaultItems = [item1, item2];

//  node js code
app.get("/", function(req,res){

    let day = date();
    Item.find({}, function(err, foundItems){
        if(foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log('Succesfully inserted');
                }
            });
            res.redirect('/');
        }else{
            res.render('lists', {listTitle: day, newListItems: foundItems});
        }
        
    });
});

app.post("/", function(req, res){
    let itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");
});

app.post("/delete", function(req,res){
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId, function(err){
        if (!err) {
          console.log("Successfully deleted checked item.");
          res.redirect("/");
        }
      });
});

app.get("/work", function(req,res){
    res.render("lists", {listTitle: "Work List", newListItems:workItems});
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});