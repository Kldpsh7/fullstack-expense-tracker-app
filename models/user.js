const Sequelize = require('sequelize');
const sequelize = require('../database/db');

const Users = sequelize.define('user',{
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    isPrime:Sequelize.BOOLEAN,
    totalExpenses:{
        type:Sequelize.INTEGER,
        default:0
    }
})

module.exports = Users;