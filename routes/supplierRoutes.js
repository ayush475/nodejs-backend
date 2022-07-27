const express=require('express');


const {  createNewSupplier, updateSupplierDetails, deleteSupplierTable, deleteSupplier } = require('../controllers/supplierController');


const router=express.Router();

// danger
router.delete('/delete/suppliertable',deleteSupplierTable);


router.post('/createnewsupplier',createNewSupplier);
router.put('/update/supplier/:supplierId',updateSupplierDetails);
router.put('/delete/supplier/:supplierId',deleteSupplier);




module.exports=router;