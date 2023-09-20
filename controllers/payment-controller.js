const path = require('path');
const User = require('../models/user');
const Order = require('../models/order');
const Razorpay = require('razorpay');
const { promises } = require('dns');
const jwt = require('jsonwebtoken');

module.exports.getBuyPremium = async (req,res,next)=>{
    try{
        let rzp = new Razorpay({
            key_id:'rzp_test_HmUSIQiqb5AlOz',
            key_secret: 'nOwiA4KzZRYapLwP3R0t6mn7'
        })
        rzp.orders.create({amount:5000,currency:'INR'}, (err,order)=>{
            if(err){
                throw new Error(err)
            }
            req.user.createOrder({orderId:order.id,paymentStatus:'PENDING'}).then(()=>{
                res.status(200).json({order, key_id:rzp.key_id})
            }).catch(err=>console.log(err))
        })
    }catch(err){
        console.log(err)
    }
}

module.exports.postPaymentDone = async (req,res,next)=>{
    try{
        let order = await Order.findOne({where:{orderId:req.body.order_id}})
        await Promise.all([ 
            order.update({paymentId:req.body.payment_id,paymentStatus:'Success'}),
            req.user.update({isPrime:true})
        ])
        res.status(200).json({message:'Success',token:jwtCrypt(req.user.Email,req.user.name,true)}).end()
    }catch(err){
        console.log(err)
    }
}

module.exports.postPaymentFailed = async (req,res,next)=>{
    console.log('here to update ststus to failed')
    let order = await Order.findOne({where:{orderId:req.body.order_id}})
    await order.update({paymentStatus:'Failed'})
    res.status(200).end()
}

function jwtCrypt(id,name,prime){
    return jwt.sign({id,name,prime},'edgbnwuydgeiqundg147982987ded7w98de7w8ed7w198edw28w98wd798e7dw9')
}