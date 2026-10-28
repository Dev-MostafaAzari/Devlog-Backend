// main 
const express = require("express");
const app = express();
require("dotenv").config();
const database = require("./database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(express.json());

// cors config
app.use(cors({
    origin : process.env.ORIGIN_URL,
    credentials : true
}));

// cookie-Parser
app.use(cookieParser());

// public files
app.use(express.static("public"));

// ----routes----

//models
const Articles = require("./models/articles");
const Users = require("./models/users");

// users
const users = require("./routes/users");
app.use("/users",users);

//relations
Users.hasMany(Articles);
Articles.belongsTo(Users);




const port = 5000;
const startServer = async ()=>{
    try {
        await database.sync(/* {force:true} */)
        app.listen(port , ()=>{
            console.log(`server is running on port ${port}`)
        })
    } catch (error) {
        console.log(error.message)
    }
}
startServer();