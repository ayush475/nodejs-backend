const express=require('express');
const { getAllOrders } = require('../controllers/orderController');
const { getAllProducts, createProductTable, dropProductTable, createNewProduct, updateProductDetails, deleteProduct, deleteProductTable, getProductDetailsForStore, getProductFullDetailsForOrder } = require('../controllers/productController');
const { isSignedIn } = require('../utils/authentication');


const router=express.Router();



// danger
// admin



router.post('/createnewProduct',createNewProduct);
router.put('/update/product/:productId',updateProductDetails);
router.put('/delete/product/:productId',deleteProduct);




// client
router.get('/store/products',getProductDetailsForStore);
router.get('/store/product/:productId',getProductFullDetailsForOrder);


module.exports=router;