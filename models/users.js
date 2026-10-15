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
    },
    mobile : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true,
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false,
    }
});

module.exports = Users;