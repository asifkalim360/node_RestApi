const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/ECOM");

//user routes
const user_routes = require("./routes/userRoute.js")

app.use('/api', user_routes)        //midddleware

app.listen(3000, function(){
    console.log("server is ready");
});