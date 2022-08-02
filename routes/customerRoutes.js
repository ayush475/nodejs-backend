const express=require('express');
const { makeCustomerAdmin } = require('../controllers/authController');
const { deleteCustomerTable, createNewCustomer, updateCustomerDetails, deleteCustomer, getCustomerLists, getCustomerTotalCount, getCustomerCompleteDetails, getCustomerNameAndProfileImage } = require('../controllers/customerController');
const { getAllOrders } = require('../controllers/orderController');
const { getAllProducts, createProductTable, dropProductTable, createNewProduct, updateProductDetails, deleteProduct, deleteProductTable } = require('../controllers/productController');
const { isSignedIn } = require('../utils/authentication');


const router=express.Router();



// danger
router.delete('/delete/customertable',deleteCustomerTable);



router.post('/createnewcustomer',createNewCustomer);
router.put('/update/customer/:customerId',updateCustomerDetails);
router.put('/delete/customer/:customerId',deleteCustomer);
router.get('/customer/lists',getCustomerLists);
router.get('/customers/count',getCustomerTotalCount);
router.get('/customer/details/:customerId',getCustomerCompleteDetails);
router.put('/make/customer/admin',makeCustomerAdmin);
router.put('/customer/nameandimage',getCustomerNameAndProfileImage);

module.exports=router;