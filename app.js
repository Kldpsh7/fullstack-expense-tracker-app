const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./database/db');

const userRoutes = require('./routes/user-routes');
const indexRoutes = require('./routes/index-routes');
const errorController = require('./controllers/errorController');
const expenseRoutes = require('./routes/expense-routes');
const paymentRoutes = require('./routes/payment-routes');
const premiumRoutes = require('./routes/premium-routes');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())
app.use(express.static(path.join(__dirname,'public')));
app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/payment',paymentRoutes);
app.use('/premium',premiumRoutes);
app.use('/',indexRoutes);
app.use(errorController.error);

Expense.belongsTo(User);
User.hasMany(Expense);

Order.belongsTo(User);
User.hasMany(Order)

sequelize.sync()
.then(()=>{
    app.listen(3000)
})
.catch(err=>console.log(err))
app.listen(5000);