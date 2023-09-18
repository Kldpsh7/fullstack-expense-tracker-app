const path = require('path');
const User = require('../models/user');

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
                User.create({
                    email:req.body.Email,
                    name:req.body.Name,
                    password:req.body.Password
                })
                .then(()=>{
                    res.status(201).json({message:"Success"})
                })
                .catch(err=>console.log('error'))
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
            }else{
                if(req.body.Password!=user.password){
                    res.status(401).json({message:"Incorrect Password"})
                }else{
                    res.status(201).json({message:"Login Successfull"})
                }
            }
        })
        .catch(e=>console.log(e));
    }
}