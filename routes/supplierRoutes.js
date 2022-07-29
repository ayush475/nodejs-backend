const express=require('express');


const {  createNewSupplier, updateSupplierDetails, deleteSupplierTable, deleteSupplier, getAllActiveSuppliers } = require('../controllers/supplierController');


const router=express.Router();

// danger
router.delete('/delete/suppliertable',deleteSupplierTable);


router.post('/createnewsupplier',createNewSupplier);
router.put('/update/supplier/:supplierId',updateSupplierDetails);
router.put('/delete/supplier/:supplierId',deleteSupplier);
router.get('/allsuppliers',getAllActiveSuppliers);


module.exports=router;