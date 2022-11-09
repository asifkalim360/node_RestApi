const User = require("../models/userModel.js");
const bcryptjs = require("bcryptjs");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
//Making a function for generate jwt token..........
const create_token = async(id) => {
    try {
        //yahan se holog token ko return krenge jo ki login login paasword ke match ke baad use kkarna hoga
        const token = await jwt.sign({_id:id},config.secrect_jwt);
        return token;
    } catch (error) {
        //set the error and error status---
        res.status(400).send(error.message)
    }
}

//----------------------------------------------------
// making securePassword() funciton......
const securePassword = async (password) => {
    try {
        const passwordHash = await bcryptjs.hash(password,10);
        return passwordHash;
    } catch (error) {
        //set the error and error status---
        res.status(400).send(error.message);
    } 
}
//----------------------------------------------------
// start user registration api method-----
const register_user = async(req, res) => {
    try{
        //secure the passowrd!!!
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name : req.body.name,
            email : req.body.email,
            password : spassword,
            mobile : req.body.mobile,
            image : req.file.filename,      //using multer
            type : req.body.type,

        })

        const userData = await User.findOne({email : req.body.email});
        if(userData)
        {
            res.status(200).send({success:false, msg:"This email is allready exists"});
        }
        else 
        {
            const user_data = await user.save();
            res.status(200).send({success:true, data:user_data});

        }
    }
    catch(error) {
        res.status(400).send(error.message);
    }
}
//end user registration api method-----
//---------------------------------------------------------------------------------------------
//start user login api method-----
const user_login = async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

       const userData = await User.findOne({email:email});
       if(userData){
            const passwordMatch = await bcryptjs.compare(password, userData.password);
            if(passwordMatch){
                //jason web token.......
                const tokenData = await create_token(userData._id);
                const userResult ={
                    _id:userData._id,
                    name:userData.name,
                    email:userData.email,
                    password:userData.password,
                    image:userData.image,
                    mobile:userData.mobile,
                    type:userData.type,
                    token:tokenData,
                }
                const response = {
                    success:true,
                    msg:"User Details",
                    data:userResult
                }
                res.status(200).send(response);
            }
            else{
                res.status(200).send({success:false, msg:"Login details are incorrect"});
            }
        }
       else{
            res.status(200).send({success:false, msg:"Login details are incorrect"})
       }

    } catch (error) {
        res.status(400).send(error.message);
    }
}
 
//start user login api method-----
//---------------------------------------------------------------------------------------------
module.exports = {
    register_user,
    user_login,
}