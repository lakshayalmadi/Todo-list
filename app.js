const express = require("express");
const bodyParser = require("body-parser");

const app = express();

var items =["test1", "test2"];
var workItems =[];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    var today = new Date();

    var options = {
        weekday : "long",
        day: "numeric",
        month: "long"
    };

    var day = today.toLocaleDateString("en-US", options);


res.render('lists', {listTitle: day, newListItems: items});
});

app.get("/work", function(req,res){
    res.render("lists", {listTitle: Worker, newListItems:workItems});
});

app.post("/", function(req,res){
    var workItem = req.body.newItem;
    workItems.push(workItem);
    res.redirect("/work");
})

app.post("/", function(req, res){
    var item = req.body.newItem;
    items.push(item);
    res.redirect("/");
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});