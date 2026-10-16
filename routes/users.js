const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// file upload config
const storage = multer.diskStorage({
    destination : (req,file,cb) => {cb(null , "public/usersPic")},
    filename : (req,file,cb)=>{cb(null , new Date().toDateString() + file.originalname)}
})
const upload = multer({
    storage : storage
});
const defaultImage = "mypic.jpg";

//get one user 


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
        const filePath = path.join(process.cwd(),"public/usersPic",req.file?.filename);
        fs.unlink(filePath,(error)=>{
            if(error){
                console.log(error.message)
            }
        })
        res.status(401).send(error.message);
        return;
    }
    const hashedPassword = await bcrypt.hash(password,10);
    try {
        await Users.create({
            name : name,
            mobile : mobile,
            password : hashedPassword,
            image : file?.filename  ? file.filename  : defaultImage,
            role : role
        });
        const token  = jwt.sign({name : name , mobile : mobile},process.env.SECRET_KEY);
        res.status(201).send([token,{name:name,mobile:mobile,image:(file?.filename ? file.filename :defaultImage)}]);
    } catch (error) {
        let errorMessage = error.message;
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