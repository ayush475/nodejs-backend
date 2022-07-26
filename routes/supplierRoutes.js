const express=require('express');


const {  createNewSupplier, updateSupplierDetails } = require('../controllers/supplierController');


const router=express.Router();


router.post('/createnewsupplier',createNewSupplier);
router.put('/update/supplier/:supplierId',updateSupplierDetails);




module.exports=router;