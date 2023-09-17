const Sequelize = require('sequelize');
const sequelize = new Sequelize('Expense-tracker','root','kldpsh7@8447',{dialect:'mysql'});
module.exports = sequelize;