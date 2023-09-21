const path = require('path');
const Expense = require('../models/expense');
const User = require('../models/user');
const { use } = require('../routes/user-routes');
const sequelize = require('../database/db');
const S3Services = require('../services/S3Services');
const Report = require('../models/reports');

module.exports.getExpense = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','expense.html'))
}

module.exports.getData = async (req,res,next)=>{
    let page = parseInt(req.query.page);
    const itemsPerPage = parseInt(req.query.itemsPerPage);
    try{
        var totalItems = await Expense.count({where:{userEmail:req.user.email}})
        let data = await req.user.getExpenses({
            offset:(page-1)*itemsPerPage,
            limit:itemsPerPage
        });
        res.status(200).json({
            items:data,
            currentPage:page,
            hasNextPage:itemsPerPage*page<totalItems,
            nextPage:page+1,
            hasPreviousPage:page>1,
            previousPage:page-1,
            lastPage:Math.ceil(totalItems/itemsPerPage)
        }).end();
    }
    catch(err){
        console.log(err)
    }
    
}

module.exports.postData = async (req,res,next)=>{
    let badReq=[null,undefined,''];
    if(badReq.includes(req.body.amount) || badReq.includes(req.body.description) || badReq.includes(req.body.category)){
        res.status(403).json({message:"Bad Request"}).end()
    }else{
        const t = await sequelize.transaction();
        try{
            await req.user.createExpense({amount:req.body.amount, description:req.body.description, category:req.body.category},{transaction:t}),
            await req.user.increment('totalExpenses',{by:req.body.amount,transaction:t})
            await t.commit()
            res.status(201).json({message:'Record Added'});
        }catch(err){
            await t.rollback()
            res.status(400).json({message:'Some error occured'});
            console.log(err);
        }
    }
}

module.exports.deleteExpense = async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        let userExpenses = await req.user.getExpenses({where:{id: req.query.id}});
        req.user.decrement('totalExpenses',{by:userExpenses[0].amount,transaction:t});
        await userExpenses[0].destroy({transaction:t});
        await t.commit();
        res.status(200).json({message:'Deleted Successfully'}).end();
    }catch(err){
        await t.rollback();
        res.status(500).json({message:'Something Wrong'}).end();
        console.log(err);
    }
}

module.exports.getReport = async (req,res,next)=>{
    try{
        const expenses = await req.user.getExpenses();
        const expenseString = JSON.stringify(expenses)
        console.log(expenseString);
        const fileUrl = await S3Services.uploadToS3(expenseString,`expenses_${req.user.email}/${new Date()}.txt`);
        await req.user.createReport({generatedOn:new Date(),fileLink:fileUrl});
        const pastReports = await req.user.getReports();
        res.status(200).json({fileUrl:fileUrl,message:'success',pastReports:pastReports}).end()
    }
    catch(err){
        console.log(err)
        res.status(500),json({message:'something wrong'}).end()
    }
}