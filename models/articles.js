// Aritcles Model
const database = require("../database");
const {DataTypes} = require("sequelize");


const Articles = database.define("articles",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey : true,
        allowNull : false,
        unique : true,
        autoIncrement : true,
    },
    state:{
        type : DataTypes.STRING,
        allowNull : false,
    },
    title:{
        type : DataTypes.STRING,
        unique : true,
        allowNull : false,
    },
    content : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    category : {
        type : DataTypes.STRING,
        allowNull : false , 
    },
    image : {
        type : DataTypes.STRING,
        allowNull : true,
        unique : false,

    }
    
});


module.exports = Articles;