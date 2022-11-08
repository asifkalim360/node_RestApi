const express = require("express");
const user_route = express();

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

const multer = require("multer");
const path = require("path");

//static files path
user_route.use(express.static('public'));

//statrt multer code
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, path.join(__dirname,"../public/userImages"), function(error, success){
            if(error) throw error;
        });
    },
    filename : function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null, name, function(error1, success1){
            if(error1) throw error1;
        })
    }
});
const upload = multer({storage: storage});
//end multer code........

const user_controller = require("../controllers/userController.js");

user_route.post("/register", upload.single('image'),user_controller.register_user);

module.exports = user_route;







