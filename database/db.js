require('dotenv').config()

const Sequelize = require('sequelize');
const sequelize = new Sequelize('Expense-tracker','root',process.env.DB_PASS,{dialect:'mysql'});
module.exports = sequelize;