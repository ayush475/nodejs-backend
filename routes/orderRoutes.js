const express=require('express');
const { getAllOrders } = require('../controllers/orderController');


const router=express.Router();


router.get('/orders',getAllOrders);


module.exports=router;