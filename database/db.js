require('dotenv').config()

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_SCHEMA,process.env.DB_USER,process.env.DB_PASS,{dialect:'mysql'});
module.exports = sequelize;