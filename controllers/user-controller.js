const path = require('path');
const User = require('../models/user');

module.exports.getSignUp = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','signup.html'))
};
module.exports.postSignUp = (req,res,next)=>{
    User.findByPk(req.body.Email)
    .then(user=>{
        if(user){
            res.send('User with this email already exists');
        }
        else{
            User.create({
                email:req.body.Email,
                name:req.body.Name,
                password:req.body.Password
            })
            .then(()=>{
                res.status(201)
                res.send('Success')
            })
            .catch(err=>console.log('error'))
        }
    })
    .catch(e=>console.log(e))
};
module.exports.getlogin = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','login.html'))
};
module.exports.postLogin = (req,res,next)=>{
    User.findByPk(req.body.Email)
    .then(user=>{
        if(!user){
            res.send('User Not Found')
        }else{
            if(req.body.Password!=user.password){
                res.send('Wrong Password')
            }else{
                res.status(201)
                res.send('Login Successfull')
            }
        }
    })
    .catch(e=>console.log(e));
    
}