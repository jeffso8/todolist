//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemsSchema = new mongoose.Schema({
  todo: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  todo: "Welcome to your todo list!"
});

const item2 = new Item({
  todo: "Hit the + button to add a new item"
});

const item3 = new Item({
  todo: "Hit the checkbox to the left to delete an item"
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (!err) {
          console.log("Succesfully saved default items to DB");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }
  });
});


app.post("/", function(req, res) {

  const itemName = req.body.newItem;

  const item4 = new Item({
    todo: itemName
  });

  item4.save()

  res.redirect("/")

  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/")
  // }

});

app.post("/delete", function(req, res) {
  const checkedItemID = req.body.checkbox;

  Item.findByIdAndDelete(checkedItemID, function(err) {
    if (!err) {
      console.log("Succesfully deleted item");
      res.redirect("/");
    }
  });
});

app.get("/:customListName", function(req, res) {
  const customListName = req.params.customListName;

  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if(!foundList){
        //Create a new list
      } else {
        //Show existing list
      }
    }
  })
  const list = new List ({
    name: customListName
    items: defaultItems
  });

  list.save()

});

app.post("/work", function(req, res) {
  let item = req.body.newItem;
  workItems.push(item);

  res.redirect("/work");
});

app.listen(3000, function() {
  console.log("Server started on Port 3000");
});
