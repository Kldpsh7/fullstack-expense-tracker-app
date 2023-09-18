const path = require('path');
const Expense = require('../models/expense');

module.exports.getExpense = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','expense.html'))
}
module.exports.getData = (req,res,next)=>{
    Expense.findAll().then(data=>res.status(200).json(data)).catch(err=>console.log(err))
}
module.exports.postData = async (req,res,next)=>{
    console.log(req.body);
    let badReq=[null,undefined,''];
    if(badReq.includes(req.body.amount) || badReq.includes(req.body.description) || badReq.includes(req.body.category)){
        res.status(403).json({message:"Bad Request"}).end()
    }else{
        try{
            let response = await Expense.create({amount:req.body.amount, description:req.body.description, category:req.body.category})
            res.status(201).json({message:'Record Added'})
        }catch(err){
            res.status(400).json({message:'Some error occured'})
            console.log(err)
        }
    }
}