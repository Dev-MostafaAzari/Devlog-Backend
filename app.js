// main 
const express = require("express");
const app = express();
require("dotenv").config();
const database = require("./database");
app.use(express.json());

// ----routes----

//models

// users
const users = require("./routes/users");
app.use("/users",users);

//ralations





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