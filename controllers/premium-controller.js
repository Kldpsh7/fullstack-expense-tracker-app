const path = require('path');
const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../database/db');


module.exports.getleaderboard = async (req,res,next)=>{
    try{
        let LBdata = await User.findAll(
            {attributes:['name','totalExpenses'],
            order:[['totalExpenses','DESC']]
        });
        res.status(200).json(LBdata).end()
    }
    catch(err){
        console.log(err)
    }
}