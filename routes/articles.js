// articles route

const express = require("express");
const router = require("express").Router();
const Articles = require("../models/articles");
const Users = require("../models/users");
const Joi = require("joi");
const multer = require("multer");
const Auth = require("../middleware/auth");
const fs = require("fs");
const path = require("path");
const {UniqueConstraintError} = require("sequelize");


// upload image config
const storage = multer.diskStorage({
    destination : (req,file,cb) => {cb(null , "public/usersArticlePic")},
    filename : (req,file,cb)=>{cb(null , new Date().toDateString() + file.originalname)}
})
const upload = multer({
    storage : storage
});


//get one Article


//get all articles (public ones)


//get all user articles


//create user article
router.post("/me/article/create",Auth,upload.single("image"),async(req,res)=>{
    const user = await Users.findOne({
        where : {mobile : req.user.mobile},
        attributes : {
            exclude : ["password"]
        }
    });
    if(!user){
        res.status(500).send("Somthing Went Wrong");
        return;
    }
    const userId = user.id;
    const file = req.file;
    const {state , title , content , category} = req.body;
    const schema = Joi.object({
        state : Joi.string().required(),
        title : Joi.string().min(3).required(),
        content : Joi.string().min(20).required(),
        category : Joi.string().required(),
        image : file?.filename ? Joi.string() : Joi.any(),
    });
    const {error} = schema.validate({
        state : state,
        title : title,
        content : content,
        category : category,
        image : file?.filename ? file.filename : null,
    });
    if(error)
    {
        const filePath = path.join(process.cwd(),"public/usersArticlePic",(req.file?.filename ? req.file?.filename : "")); // filePath cannot be undefind
        fs.unlink(filePath,(error)=>{
            if(error){
                console.log(error.message)
            }
        })
        res.status(403).send(error.message);
        return;
    };
    try {
        await Articles.create({
            state : state,
            title : title ,
            content : content,
            category : category,
            image : file?.filename ? file.filename : null,
            userId : userId
        })
        res.status(201).send("Article Successfuly Created")
    } catch (error) {
        let errorMessage = error.message;
        if(error.errors)
        {
            error.errors.map(item => {
                errorMessage = errorMessage + `\n ${item.message}`
            })
        }
        res.status(401).send(errorMessage);
    }

})

//update user article


//delete user article


module.exports = router;