const express=require('express');
const { getOutOFStockProducts, getLowStockProducts } = require('../controllers/alertController');
const { login } = require('../controllers/authController');

const {isSignedIn}=require('../utils/authentication')


const router=express.Router();

// root allert 
router.get('/products/outofstock',getOutOFStockProducts);
router.get('/products/lowstock',getLowStockProducts);


module.exports=router;