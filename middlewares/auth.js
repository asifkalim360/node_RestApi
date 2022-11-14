/*
es middleware ka use humlog jwt authentication karneke liye krenge.
*/ 

const jwt = require("jsonwebtoken");
const config = require("../config/config");

const verifyToken = async(req,res,next ) => {
    const token = req.body.token || req.query.token || req.headers["authorization"];

    if(!token)
    {
        res.status(200).send({success:false, msg:"A token is require for authentication."});  
    }
    try {
        const decode = jwt.verify(token, config.secrect_jwt);
        req.user = decode;
    } catch (error) {
        res.status(400).send({success:false, msg:"Invalid Token."});  
    }
    return next();
 }

module.exports = verifyToken;
