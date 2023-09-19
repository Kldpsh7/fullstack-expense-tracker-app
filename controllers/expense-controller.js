const path = require('path');
const Expense = require('../models/expense');
const User = require('../models/user');

module.exports.getExpense = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','expense.html'))
}

module.exports.getData = (req,res,next)=>{
    req.user.getExpenses().then(data=>res.status(200).json(data)).catch(err=>console.log(err))
}

module.exports.postData = async (req,res,next)=>{
    let badReq=[null,undefined,''];
    if(badReq.includes(req.body.amount) || badReq.includes(req.body.description) || badReq.includes(req.body.category)){
        res.status(403).json({message:"Bad Request"}).end()
    }else{
        try{
            let response = await req.user.createExpense({amount:req.body.amount, description:req.body.description, category:req.body.category})
            res.status(201).json({message:'Record Added'})
        }catch(err){
            res.status(400).json({message:'Some error occured'})
            console.log(err)
        }
    }
}

module.exports.deleteExpense = async (req,res,next)=>{
    console.log(req.query.id)
    try{
        await req.user.removeExpense(req.query.id)
        res.status(200).json({message:'Deleted Successfully'}).end()
    }catch(err){
        res.status(500).json({message:'Something Wrong'}).end()
        console.log(err)
    }
}