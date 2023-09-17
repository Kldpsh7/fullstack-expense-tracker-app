const path = require('path');
const User = require('../models/user');

module.exports.getSignUp = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','signup.html'))
};
module.exports.postSignUp = (req,res,next)=>{
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