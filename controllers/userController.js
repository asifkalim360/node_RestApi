const User = require("../models/userModel.js");
const bcryptjs = require("bcryptjs");


// making securePassword() funciton......
const securePassword = async (password ) => {
    try {
        const passwordHash = await bcryptjs.hash(password,10);
        return passwordHash;
    } catch (error) {
        res.status(400).send(error.message);
    } 
}

const register_user = async(req, res) => {
    try{
        //secure the passowrd!!!
        const secure_password = await securePassword(req.body.password);
        const user = new User({
            name : req.body.name,
            email : req.body.email,
            password : secure_password,
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


module.exports = {
    register_user,
}