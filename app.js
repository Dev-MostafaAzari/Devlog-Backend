// main 
const express = require("express");
const app = express();
require("dotenv").config();
const database = require("./database");
const cors = require("cors");
app.use(express.json());
// cors config
app.use(cors({
    origin : process.env.ORIGIN_URL
}));

// public files
app.use(express.static("public"));

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