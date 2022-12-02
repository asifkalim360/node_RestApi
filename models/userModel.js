const mongoose = require("mongoose");

const user = mongoose.Schema({
    name : {
        type:String,
        require:true
    },
    email : {
        type:String,
        require:true
    },
    password  : {
        type:String,
        require:true
    },
    image : {
        type:String, 
        require:true
    },
    mobile : {
        type:String,
        require:true
    },
    type : {
        type:Number,
        require:true
    },
    token : {
        type:String,
        default:''
    },
});

module.exports = mongoose.model("User", user)