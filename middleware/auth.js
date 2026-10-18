//checking the jwt

const jwt = require("jsonwebtoken");

const Auth  = (req,res,next)=>{
    const token = req.cookies.accessToken;

    if(!token){
        return res.status(401).send("Authentication Required");
    }

    try {
        jwt.verify(token , process.env.SECRET_KEY);
        next();
    } catch (error) {
        res.status(401).send(error.message);
    }

}

module.exports = Auth;