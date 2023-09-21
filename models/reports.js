const Sequelize = require('sequelize');
const sequelize = require('../database/db');

const Report = sequelize.define('report', {
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    generatedOn:Sequelize.DATE,
    fileLink:Sequelize.STRING
})

module.exports = Report;