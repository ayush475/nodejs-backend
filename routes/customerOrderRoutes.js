const express=require('express');
const { createNewCustomerOrder, updateCustomerOrderDetails, cancelCustomerOrder, getCustomerOrderShippedOrProcessingOrdersList, getCustomerOrdersListByFilter, getCustomerOrderTotalCount, getTotalRevenue, getTopSales, getCustomerOrderCompleteDetails } = require('../controllers/customerOrderController');
const { createNewMyOrder, updateMyOrderDetails, cancelMyOrder } = require('../controllers/myOrderController');
const { getAllOrders } = require('../controllers/orderController');
const { getAllProducts, createProductTable, dropProductTable, createNewProduct, updateProductDetails, deleteProduct, deleteProductTable } = require('../controllers/productController');
const { isSignedIn } = require('../utils/authentication');


const router=express.Router();

console.log("lll");

router.post('/createnewcustomerorder',isSignedIn,createNewCustomerOrder);
router.put('/update/customerorder/:customerOrderId',updateCustomerOrderDetails);
router.put('/cancel/customerorder/:customerOrderId',cancelCustomerOrder);
router.get('/shippedorprocessingcustomerorderlist',getCustomerOrderShippedOrProcessingOrdersList);
router.get('/customerorders/filter',getCustomerOrdersListByFilter);
router.get('/customerorders/count',getCustomerOrderTotalCount);
router.get('/revenue',getTotalRevenue);
router.get('/topsales',getTopSales);
router.get('/customerorder/details/:orderId',getCustomerOrderCompleteDetails);


module.exports=router;