const express=require('express');


const {  createNewSupplier, updateSupplierDetails, deleteSupplierTable, deleteSupplier, getAllActiveSuppliers, getSupplierNameAndImage, getSupplierLists } = require('../controllers/supplierController');


const router=express.Router();

// danger
router.delete('/delete/suppliertable',deleteSupplierTable);


router.post('/createnewsupplier',createNewSupplier);
router.put('/update/supplier/:supplierId',updateSupplierDetails);
router.put('/delete/supplier/:supplierId',deleteSupplier);
router.get('/allsuppliers',getAllActiveSuppliers);
router.get('/suppliernameandimage/:supplierId',getSupplierNameAndImage);
router.get('/supplier/lists',getSupplierLists);


module.exports=router;