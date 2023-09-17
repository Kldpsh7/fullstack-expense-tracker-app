const path = require('path');

module.exports.getIndex = (req,res,next)=>{
    res.redirect('/user/signup')
}