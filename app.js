const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require('lodash');

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoDB code

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true,
useCreateIndex: true,
useUnifiedTopology: true,
useFindAndModify: false});  

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model('List', listSchema);

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

app.get("/:customListName", function(req,res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
            
                list.save();
                res.redirect('/'+customListName);
            }else{
                res.render('lists', {listTitle: foundList.name , newListItems: foundList.items});
            }
        }
    });
});

app.post("/", function(req, res){
    const itemName = req.body.newItem;
    const listName = req.body.list;
    let day = date();
    const item = new Item({
        name: itemName
    });

    if(listName === day){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect('/'+listName);
        })
    }
    
});

app.post('/delete', function(req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    let day = date();

    if(listName === day){
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if (!err) {
              console.log("You deleted the item, letsgoooooooo!");
              res.redirect('/');
            }
          });
    }else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
            if(!err){
                res.redirect('/'+listName);
            }
        })
    }
    

    });


app.listen(3000, function(){
    console.log("Server started on port 3000");
});