const path = require('path');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Sib = require('sib-api-v3-sdk');
require('dotenv').config();
const PasswordResetRequest = require('../models/passwordResetRequests');
const {v4:uuidv4} = require('uuid');


module.exports.getResetPassword = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','resetPassword.html'))
}

module.exports.postResetPassword = async (req,res,next)=>{
    console.log('This user forgot his password>>>>>',req.body.email)
    let badReq=[null,undefined,''];
    if(badReq.includes(req.body.email)){
        res.status(403).json({message:"Bad Request"}).end();
    }
    else{
        try{
            const user = await User.findByPk(req.body.email)
            if(!user){
                res.status(404).json({message:'User Not Found'}).end();
            }else{
                const email = req.body.email;
                const uuid = uuidv4();
                const resetLink = `${process.env.MYENDPOINT}/password/reset?id=${uuid}`;
                await user.createPasswordResetRequest({id:uuid,active:true})
                const mailtoken = await sendEmail(email,resetLink);
                console.log(mailtoken);
                res.status(201).json({messgae:'Reset Mail Sent'}).end();
            }
        }
        catch(err){
            console.log(err);
        }
    }
}

function sendEmail(email,resetLink){
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.SIB_API_KEY;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
        email:'kldpsh77@getMaxListeners.com',
        name:'Expense Tracker'
    }
    const reciever = [{
        email: email
    }]
    return tranEmailApi.sendTransacEmail({
        sender,
        to:reciever,
        subject:'Reset your Expense Tracker App Password',
        htmlContent:`<a href="${resetLink}">Click on this link to reset your password</a>`
    })
}

module.exports.getResetPage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','newPassword.html'));
}

module.exports.postResetPage = async (req,res,next)=>{
    const uuid = req.query.id;
    try{
        let resetReq = await PasswordResetRequest.findByPk(uuid);
        if(!resetReq || resetReq.active==false){
            res.status(403).json({message:'Unauthorised Request'}).end()
        }
        else{
            let user = await User.findByPk(resetReq.userEmail);
            let hash = await bcrypt.hash(req.body.password,10);
            await Promise.all([
            user.update({password:hash}),
            resetReq.update({active:false})])
            res.status(201).json({message:'success'}).end()
        }
    }
    catch(err){
        console.log(err)
    }
    
}