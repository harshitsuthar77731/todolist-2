const express = require("express");
const bodyparser = require("body-parser");
const app = express();
app.use(bodyparser({extended:true}));
app.use(express.static("public"));
const mongoose = require("mongoose");
const { render } = require("ejs");
const __ = require("lodash");



app.set('view engine','ejs');
let work=[];


//connecting to server
mongoose.connect("mongodb+srv://harshit-admin:1234@cluster0.zcq4o.mongodb.net/todolistDB");

// creating schema

const itemsSchema = new mongoose.Schema({
name : String,
});

const listschema = new mongoose.Schema({
    name :  String,
    items : [itemsSchema]
})

//creating model/collection

const itemdb =  mongoose.model("itemdb",itemsSchema); 

const List = mongoose.model("Lists",listschema);

// inserting data;
let itema = new itemdb({
    name  : "Welcome to todolist!"
    });
let itemb = new itemdb({
    name  : "Hit the + button to add new item"
    });
let itemc = new itemdb({
    name  : "<-- hit this to delete an item"
    });

let defaultvalue = [itema,itemb,itemc];


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
    let value  = req.body.nextItem;
    let listname = req.body.list;
    if(listname==="Today")
    {
    let temp = new itemdb({
        name  : value,
        });
    temp.save();
    res.redirect("/")
    }
    else
    {
        List.findOne({name: listname},function(err,data){
            let temp = new itemdb({
                name: value
            });
            data.items.push(temp);
            data.save();
        })
        res.redirect("/"+listname);
    }
 })


 app.post("/delete",function(req,res){
    let temp = req.body;
    console.log(temp);
    //delete by id
    if(temp.listtitle==="Today"){
        itemdb.deleteOne({_id:temp.deleteid},function(err){
        if(err)
            console.log(err);
        else
            console.log("successfully deleted");
        })
        res.redirect("/");
        }
    else
    {
        
                List.update({name:temp.listtitle},{"$pull":{"items":{ "_id":temp.deleteid}}},{ safe: true, multi:true },function(err,data){
                    if(err)
                    {
                        console.log(err);
            
                    }
                    else
                    {
                        console.log("succesfully deleted");
                        
                    }
                    res.redirect("/"+temp.listtitle);
                })
    


            }} );



app.get("/:customlist",function(req,res){

    let customlist = __.capitalize(req.params.customlist);
    List.findOne({name:customlist},function(err,data){
       if(!err){

       // console.log(data);
        if(!data)
        {
           const temp = new List({
               name: customlist,
               items: defaultvalue
           })
           temp.save();
           res.redirect("/"+customlist)
        }
        else
        {
           // console.log(data);
            res.render("list",{listTitle:data.name,newListItem: data.items })
         }
    }});
})


//listinig to server 3000

app.listen(3000,function(){
    console.log(`listining to server 3000`);
})