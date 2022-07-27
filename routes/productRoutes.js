const express=require('express');
const { getAllOrders } = require('../controllers/orderController');
const { getAllProducts, createProductTable, dropProductTable, createNewProduct, updateProductDetails, deleteProduct, deleteProductTable } = require('../controllers/productController');
const { isSignedIn } = require('../utils/authentication');


const router=express.Router();



// danger
router.delete('/delete/producttable',deleteProductTable);



router.post('/createnewProduct',createNewProduct);
router.put('/update/product/:productId',updateProductDetails);
router.put('/delete/product/:productId',deleteProduct);


module.exports=router;