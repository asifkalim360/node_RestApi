const User = require("../models/userModel.js");
const bcryptjs = require("bcryptjs");           //using for code hashing
const config = require("../config/config.js");  //using for secret jwt token key.
const jwt = require("jsonwebtoken");            //using for jwt token.
const nodemailer = require("nodemailer");       //using for smtp mailing 
const randomstring = require("randomstring");   //using for generating ramdom strings.


//Making a function for generate email token and reset password..........
const sendResetPasswordMail = async(name, email, token) => {
    try {
        const tranporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        });
 
        const mailOptions = {
            from : config.emailUser,
            to:email,
            subject:'For reset Password',
            html:'<p>Hi ' +name+ ', Please copy the link end <a href="http://127.0.0.1:3000/api/reset-password?token='+token+'"></a></p>'
        }
        tranporter.sendMail(mailOptions, function(error,info) {
            if(error)
            {
                console.log(error)
            } 
            else 
            {
                console.log("Mail has been Sent :- ", info.response)
            }
        });
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }
}

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

        });

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
                // json web token.......
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
            res.status(200).send({success:false, msg:"Login details are incorrect!!!"});
       }

    } catch (error) {
        res.status(400).send(error.message);
    }
}
//start user login api method-----
//---------------------------------------------------------------------------------------------

//Start Update Password method------ 
const update_password = async(req,res) => {
    try {
        const user_id = req.body.user_id;
        const password = req.body.password;

        if(user_id=='')
        {
            res.status(200).send({success:false, msg:"please Enter your user id's"});
        }
        else 
        {
            const data = await User.findOne({_id:user_id});
            if(data)
            {
                const newPassword = await securePassword(password);
                const userData = await User.findByIdAndUpdate({_id:user_id}, {$set: {
                    password:newPassword
                }});
                res.status(200).send({success:true, msg:"Your Password has  been Updated!"})
            }
            else 
            {
                res.status(200).send({success:false, msg:"User Id Not Found!"});
            }
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//End Update Password method------
//----------------------------------------------------------------------------------------------

//Start Update Password method------ 
const forget_password = async(req,res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if(userData)
        {
            
            const randomString = randomstring.generate();
            const data = await User.updateOne({email:email}, {$set: {token:randomString}});
            sendResetPasswordMail(userData.name, userData.email, randomString);
            res.status(200).send({success:true, msg:"Please check your Email and reset your password !!!"});      
        }
        else 
        {
            res.status(200).send({success:true, msg:"This Email does not exists!!!"});   
        }
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }
}

//End Update Password method------
//----------------------------------------------------------------------------------------------


module.exports = {
    register_user,
    user_login,
    update_password,
    forget_password,
}