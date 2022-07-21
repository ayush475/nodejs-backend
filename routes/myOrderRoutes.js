const express=require('express');
const { getAllMyOrders } = require('../controllers/myOrderController');


const router=express.Router();


router.get('/myorders',getAllMyOrders);

module.exports=router;