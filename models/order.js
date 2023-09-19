const Sequelize = require('sequelize');
const sequelize = require('../database/db')

const Order = sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    orderId:Sequelize.STRING,
    paymentId:Sequelize.STRING,
    paymentStatus:Sequelize.STRING
})

module.exports = Order;