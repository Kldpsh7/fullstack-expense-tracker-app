const path = require('path');
const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../database/db');


module.exports.getleaderboard = async (req,res,next)=>{
    try{
        let LBdata = await User.findAll(
            {attributes:['email','name',[sequelize.fn('sum', sequelize.col('expenses.amount')),'totalExpenses']],
            include:[{model:Expense,attributes:[]}],
            group:['user.email'],
            order:[['totalExpenses','DESC']]
        });
        res.status(200).json(LBdata).end()
    }
    catch(err){
        console.log(err)
    }
}