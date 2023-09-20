const Sequelize = require('sequelize');
const sequelize = require('../database/db');

const PasswordResetRequest = sequelize.define('passwordResetRequest',{
    id:{
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey:true,
    },
    active:{
        type:Sequelize.BOOLEAN,
        default:true
    }
})

module.exports = PasswordResetRequest;