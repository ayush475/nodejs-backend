const express=require('express');
const { createNewMyOrder, updateMyOrderDetails, cancelMyOrder, getImportShippedOrProcessingOrdersList, getImportOrdersListByFilter, myOrderIsDeivered, getMyorderTotalCount, getTopImports, getMyOrdercompleteDetails } = require('../controllers/myOrderController');
const { getAllOrders } = require('../controllers/orderController');
const { getAllProducts, createProductTable, dropProductTable, createNewProduct, updateProductDetails, deleteProduct, deleteProductTable } = require('../controllers/productController');
const { isSignedIn } = require('../utils/authentication');


const router=express.Router();







router.post('/importnewProduct',createNewMyOrder);
router.put('/update/import/:myOrderId',updateMyOrderDetails);
router.put('/cancel/import/:myOrderId',cancelMyOrder);
router.get('/shippedorprocessingimportorderlist',getImportShippedOrProcessingOrdersList);
router.get('/imports/filter',getImportOrdersListByFilter);
router.get('/imports/count',getMyorderTotalCount);
router.get('/topimports',getTopImports);
router.get('/myorder/details/:myOrderId',getMyOrdercompleteDetails);

module.exports=router;