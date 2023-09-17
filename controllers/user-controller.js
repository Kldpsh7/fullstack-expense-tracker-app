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
}