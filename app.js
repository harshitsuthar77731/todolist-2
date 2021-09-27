const express = require("express");
const bodyparser = require("body-parser");
const app = express();
app.use(bodyparser({extended:true}));
app.use(express.static("public"));
const mongoose = require("mongoose");

app.set('view engine','ejs');
let work=[];



mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = new mongoose.Schema({
name : String,
});


const itemdb =  mongoose.model("itemdb",itemsSchema); 

let itema = new itemdb({
    name  : "Welcome to todolist!"
    });
let itemb = new itemdb({
    name  : "Hit the + button to add new item"
    });
let itemc = new itemdb({
    name  : "<-- hit this to delete an item"
    });

app.get("/",function(req,res){
 
    itemdb.find(function(err,data){
        if(data.length===0)
        {
            itemdb.insertMany([itema,itemb,itemc],function(err){
                if(err)
                {
                    console.log(err);
                }
                else{
                    console.log("succesfully inserted");
                }
                
                })
            res.redirect("/");
        }
        else
        {
        res.render("list", {listTitle: "Today",newListItem: data})

        }
    })
    
});


app.post("/",function(req,res){
    let items  = req.body.nextItem;
    console.log(req.body);
    let temp = new itemdb({
        name  : items,
        });
    temp.save();
    res.redirect("/")
 })


 app.post("/delete",function(req,res){
    let temp = req.body;
    console.log(temp.deleteid);
    //delete by id
    itemdb.deleteOne({_id:temp.deleteid},function(err){
    if(err)
        console.log(err);
    else
        console.log("successfully deleted");
    });


    res.redirect("/");
 })

//  app.get("/work",function(req,res){
//      res.render("list",{listTitle:"Work",newListItem:work})
//  })
// app.get("/about",function(req,res){
//     res.render("about");
// })


app.listen(3000,function(){
    console.log(`listining to server 3000`);
})

