const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.authenticate = (req,res,next)=>{
    let token = req.headers.auth;
    let username = jwt.decode(token,'edgbnwuydgeiqundg147982987ded7w98de7w8ed7w198edw28w98wd798e7dw9')
    User.findByPk(username)
    .then(user=>{
        req.user=user;
        next()
    }).catch(err=>{
        console.log(err)
        res.status(403).json({message:'Unauthorised'})
    })
}