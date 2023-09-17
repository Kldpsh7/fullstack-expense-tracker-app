const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./database/db');

const userRoutes = require('./routes/user-routes');
const indexRoutes = require('./routes/index-routes');
const errorController = require('./controllers/errorController');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/user',userRoutes);
app.use('/',indexRoutes);
app.use(errorController.error);

sequelize.sync()
.then(()=>{
    app.listen(3000)
})
.catch(err=>console.log(err))
app.listen(5000);