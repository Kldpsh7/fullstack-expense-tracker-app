const path = require('path');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.getSignUp = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','signup.html'))
};
module.exports.postSignUp = (req,res,next)=>{
    let badReq=[null,undefined,''];
    if(badReq.includes(req.body.Email) || badReq.includes(req.body.Name) || badReq.includes(req.body.Password)){
        res.status(403).json({message:"Bad Request"}).end()
    }
    else {
        User.findByPk(req.body.Email)
        .then(user=>{
            if(user){
                res.status(401).json({message:"User with this email already exists"});
            }
            else{
                bcrypt.hash(req.body.Password,10)
                .then(hash=>{
                    User.create({
                        email:req.body.Email,
                        name:req.body.Name,
                        password:hash
                    })
                    .then(()=>{
                        res.status(201).json({message:"Success"})
                    }).catch(err=>console.log('error'))
                }).catch(err=>console.log('error'))
            }
        })
        .catch(e=>console.log(e))
    }
};
module.exports.getlogin = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','login.html'))
};
module.exports.postLogin = (req,res,next)=>{
    let badReq=[null,undefined,''];
    if(badReq.includes(req.body.Email) || badReq.includes(req.body.Password)){
        res.status(403).json({message:"Bad Request"}).end()
    }
    else {
        User.findByPk(req.body.Email)
        .then(user=>{
            if(!user){
                res.status(404).json({message:"User Not Found"})
            }
            else{
                bcrypt.compare(req.body.Password,user.password,(err,success)=>{
                    if(success){
                        res.status(201).json({message:"Login Successfull",token:jwtCrypt(user.email)})
                    }else{
                        res.status(401).json({message:"Incorrect Password"})
                    }
                })       
            }
        }).catch(e=>console.log(e));
    }
}

function jwtCrypt(id){
    return jwt.sign(id,'edgbnwuydgeiqundg147982987ded7w98de7w8ed7w198edw28w98wd798e7dw9')
}