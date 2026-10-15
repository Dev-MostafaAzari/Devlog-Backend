// main 
const express = require("express");
const app = express();
require("dotenv").config();
const database = require("./database");

const port = 5000;

const startServer = async ()=>{
    try {
        await database.sync({force:true})
        app.listen(port , ()=>{
            console.log(`server is running on port ${port}`)
        })
    } catch (error) {
        console.log(error.message)
    }
}
startServer();