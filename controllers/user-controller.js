const path = require('path');
const User = require('../models/user');

module.exports.getSignUp = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','signup.html'))
};
module.exports.postSignUp = (req,res,next)=>{
    let userAlreadyeExist=null;
    User.findByPk(req.body.Email).then(user=>{userAlreadyeExist=user}).catch(e=>console.log(e))
    if(userAlreadyeExist==null){
        res.send('User with this email already exists')
    }
    else{
        User.create({
            email:req.body.Email,
            name:req.body.Name,
            password:req.body.Password
        })
        .then(()=>{
            res.send('Success')
        })
        .catch(err=>console.log(err))
    }
};
module.exports.getlogin = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','login.html'))
};
module.exports.postLogin = (req,res,next)=>{
    let user = null;
    User.findByPk(req.body.Email).then(u=>user=u).catch(e=>console.log(e));
    if(user == null){
        res.send()
    }
    else{
        if(req.body.Password==user.password){
            res.json(user)
        }
        else{
            res.send()
        }
    }
}