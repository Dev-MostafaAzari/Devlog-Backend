const {DataTypes} = require("sequelize");
const database = require("../database");

const Users = database.define("users",{
    id:{
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        unique : true,
        primaryKey : true
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true,
    },
    firstname:{
        type : DataTypes.STRING,
        allowNull : true,
    },
    lastname : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    mobile : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true,
    },
    email : {
        type : DataTypes.STRING,
        allowNull : true,
        unique : true,
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    image : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    role : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    social_1 : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    social_2 : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    social_3 : {
        type : DataTypes.STRING,
        allowNull : true,
    }
});

module.exports = Users;