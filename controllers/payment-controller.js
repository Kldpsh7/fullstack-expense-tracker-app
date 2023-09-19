const path = require('path');
const User = require('../models/user');
const Order = require('../models/order');
const Razorpay = require('razorpay')

module.exports.getBuyPremium = async (req,res,next)=>{
    try{
        let rzp = new Razorpay({
            key_id:'rzp_test_U7MDAYdbbmebHV',
            key_secret: '64S3Fld2eNTnkvTqIWqeQJq1'
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
    let order = await Order.findOne({where:{orderId:req.body.order_id}})
    await order.update({paymentId:req.body.payment_id,paymentStatus:'Success'})
    await req.user.update({isPrime:true})
    res.status(200).json({message:'Success',primeStatus:req.user.isPrime}).end()
}