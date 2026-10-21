const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {UniqueConstraintError} = require("sequelize");
const Auth = require("../middleware/auth");

// file upload config
const storage = multer.diskStorage({
    destination : (req,file,cb) => {cb(null , "public/usersPic")},
    filename : (req,file,cb)=>{cb(null , new Date().toDateString() + file.originalname)}
})
const upload = multer({
    storage : storage
});
const defaultImage = "mypic.jpg";

// get user with mobile and password
router.post("/login",async (req , res)=>{
    const {mobile , password} = req.body;
    const user  = await Users.findOne({
        where : {mobile : mobile}
    });
    if(!user)
    {
        res.status(402).send("Mobile or Password is incorrect!");
        return;
    }
    const isPassword = await bcrypt.compare(password , user.password);
    if(!isPassword)
    {
        res.status(401).send("Mobile or Password is incorrect!");
        return;
    }
    try {
        const token = jwt.sign({name: user.name , mobile : user.mobile},process.env.SECRET_KEY,{expiresIn:24*60*60*1000});
        res.cookie("accessToken",token,{
            httpOnly : true,
            secure : false,
            sameSite :"lax",
            maxAge : 24*60*60*1000,
            path:"/"
        });
        res.status(200).send("login was successful");
    } catch (error) {
        let errorMessage = error.message;
        if(error.errors)
        {
            error.errors.map(item => {
                errorMessage = errorMessage + `\n ${item.message}`
            });
        };
        res.status(500).send(errorMessage);
    }
});

//get one user 
router.get("/me",Auth,async(req,res)=>{
    const user = await Users.findOne({
        where : {mobile : req.user.mobile},
        attributes : {
            exclude : ["password"]
        },
    });
    if(!user)
    {
        res.status(404).send("Somthing Went wrong");
        return;
    }
    res.status(200).send(user);
});


// create user
router.post("/signIn", upload.single("image") ,async (req , res)=>{
    const file = req.file;
    const {name , mobile , password} = req.body;
    const role = "user";
    const schema = Joi.object({
        name : Joi.string().min(3).required(),
        mobile : Joi.string().min(10).required(),
        password : Joi.string().min(6).required(),
        image : Joi.string().required()
    });
    const {error} = schema.validate({
        name : name,
        mobile : mobile,
        password : password,
        image : file?.filename ? file.filename  : defaultImage
    });
    if(error){
        // delete file on validation error from public/usersPic
        const filePath = path.join(process.cwd(),"public/usersPic",(req.file?.filename ? req.file?.filename : "")); // filePath cannot be undefind
        fs.unlink(filePath,(error)=>{
            if(error){
                console.log(error.message)
            }
        })
        res.status(401).send(error.message);
        return;
    }
    // hashedPassword
    const hashedPassword = await bcrypt.hash(password,10);
    try {
        await Users.create({
            name : name,
            mobile : mobile,
            password : hashedPassword,
            image : file?.filename  ? file.filename  : defaultImage,   // if no image given set defaultImage 
            role : role
        });
        // create jwt
        const token  = jwt.sign({name : name , mobile : mobile},process.env.SECRET_KEY,{expiresIn:24*60*60*1000});
        // set token in cookie and send to front
        res.cookie("accessToken",token,{
            httpOnly : true,
            secure : false,
            sameSite :"lax",
            maxAge : 24*60*60*1000,
            path:"/"
        })
        res.status(201).send("your Account Created !");
    } catch (error) {
        let errorMessage = error.message;
        if(error instanceof UniqueConstraintError)
        {
            res.status(409).send("This mobile number already exist!")
            return;
        }
        if(error.errors){
            error.errors.map(item => {
                errorMessage = errorMessage + `\n ${item.message}`
            })
        }
        res.status(500).send(errorMessage);
    }
});

//updata user





module.exports = router;