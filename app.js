const express=require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
dotenv.config({path:"./config/.env"})

const authRoutes=require('./routes/authRoutes');
const customerRoutes=require('./routes/customerRoutes');
const orderRoutes=require('./routes/orderRoutes');
const supplierRoutes=require('./routes/supplierRoutes');
const myOrderRoutes=require('./routes/myOrderRoutes');
const productRoutes=require('./routes/productRoutes');
const categoryRoutes =require('./routes/categoryRoutes');
const errorMiddleware = require('./middlewares/error');



const app=express();




// middlewares
app.use(express.json());
app.use(morgan('tiny'));







// routes
app.use('/',authRoutes);
app.use('/',customerRoutes); // customer routes
app.use('/',productRoutes); // customer routes
app.use('/',supplierRoutes); // customer routes
app.use('/',orderRoutes); // customer routes
app.use('/',myOrderRoutes); // customer routes
app.use('/',categoryRoutes);


//  custom middlewares
app.use(errorMiddleware);

app.get('/',(req,res)=>{
    res.status(200).json({title:"welcome to tec inventory dbms project",
members:['Ayush Acharya','Anupham Bhattrai','Jagadish Shrestha','Mahesh Banjade']});
})





module.exports=app;