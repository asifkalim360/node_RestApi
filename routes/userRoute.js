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
        });   
    }
});
const upload = multer({storage: storage});
//end multer code----------------------------------------------

const auth = require("../middlewares/auth"); 

const user_controller = require("../controllers/userController.js");

// route for register api
user_route.post("/register", upload.single('image'),user_controller.register_user);  

// route for login api
user_route.post("/login", user_controller.user_login);  

/*
jwt authentication ko test karne ke liye api bnaya hai.
eslea eska function controller ke bjaye yahin pe bna diya hai.
kyunki esko sirf testing ke liye bna rhe hain.
*/
// route for testAuth api
user_route.get("/testAuth", auth, function(req,res) {
    res.send({success:true, msg:"Authentication successfully"})
});

// route for update-password api
user_route.post('/update-password', auth, user_controller.update_password);


module.exports = user_route;







