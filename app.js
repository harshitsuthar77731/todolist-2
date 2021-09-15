const express = require("express");
const bodyparser = require("body-parser");
const app = express();
app.use(bodyparser({extended:true}));

app.set('view engine','ejs');
let item=[];
//let items;
app.get("/",function(req,res){
    let date = new Date();
    let options ={
        weekday : "long",
        day: "numeric",
        month: "long"
    };
    let day = date.toLocaleDateString("en-US",options);
    res.render("list", {kindofday: day,x: item});
});
app.post("/",function(req,res){
    let items  = req.body.nextItem;
    item.push(items);
    res.redirect("/");
 })


app.listen(3000,function(){
    console.log(`listining to server 3000`);
})