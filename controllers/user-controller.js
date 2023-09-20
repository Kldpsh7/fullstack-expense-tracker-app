const path = require('path');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

module.exports.getSignUp = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','signup.html'))
};

module.exports.postSignUp = async (req,res,next)=>{
    let badReq=[null,undefined,''];
    if(badReq.includes(req.body.Email) || badReq.includes(req.body.Name) || badReq.includes(req.body.Password)){
        res.status(403).json({message:"Bad Request"}).end();
    }
    else {
        try{
            let user = await User.findByPk(req.body.Email)        
            if(user){
                res.status(401).json({message:"User with this email already exists"});
            }
            else{
                let hash = await bcrypt.hash(req.body.Password,10);           
                await User.create({email:req.body.Email, name:req.body.Name, password:hash});                  
                res.status(201).json({message:"Success"});               
        }}
        catch(err){
            console.log(err);
        }
    }
};

module.exports.getlogin = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','login.html'))
};

module.exports.postLogin = async (req,res,next)=>{
    let badReq=[null,undefined,''];
    if(badReq.includes(req.body.Email) || badReq.includes(req.body.Password)){
        res.status(403).json({message:"Bad Request"}).end()
    }
    else {
        try{
            let user = await User.findByPk(req.body.Email)
            if(!user){
                    res.status(404).json({message:"User Not Found"})
            }
            else{
                bcrypt.compare(req.body.Password,user.password,(err,success)=>{
                    if(success){
                        res.status(201).json({message:"Login Successfull",token:jwtCrypt(user.email,user.name,user.isPrime)})
                    }else{
                        res.status(401).json({message:"Incorrect Password"})
                    }
                })       
            }
        }
        catch(err){
            console.log(err)
        }
    }
}

function jwtCrypt(id,name,prime){
    return jwt.sign({id,name,prime},'edgbnwuydgeiqundg147982987ded7w98de7w8ed7w198edw28w98wd798e7dw9')
}

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
                const mailtoken = await sendEmail()
                console.log(mailtoken)
                res.status(201).json({messgae:'Reset Mail Sent'}).end();
            }
        }
        catch(err){
            console.log(err);
        }
    }
}

function sendEmail(){
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.SIB_API_KEY;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
        email:'kldpsh77@getMaxListeners.com',
        name:'Expense Tracker'
    }
    const reciever = [{
        email:'kldpsh7@gmail.com'
    }]
    return tranEmailApi.sendTransacEmail({
        sender,
        to:reciever,
        subject:'Reset your Password',
        textContent:'Test Email'
    })
}