//modules
const express=require("express");
const hbs=require("hbs");
const path=require("path");

//
const app=express();
//
app.use( express.urlencoded({extended:true}) )
app.use(express.static(path.join(__dirname,"../frontEnd/public")));
app.set("view engine","hbs");
app.set("views",path.join(__dirname,"../frontEnd/views"));
hbs.registerPartials(path.join(__dirname,"../frontEnd/layout"));

//

const router=require("../app/routes/routter");
app.use(router);


module.exports = app
