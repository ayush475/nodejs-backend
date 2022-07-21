const express=require('express');
const { getAllOrders } = require('../controllers/orderController');
const { getAllProducts, createProductTable, dropProductTable, createNewProduct } = require('../controllers/productController');


const router=express.Router();



// root allert 
router.post('/createproducttable',createProductTable);
router.delete('/dropproductTable',dropProductTable);


// products
router.post('/createnewproduct',createNewProduct);


router.get('/products',getAllProducts);


module.exports=router;