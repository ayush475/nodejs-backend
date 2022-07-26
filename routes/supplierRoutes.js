const express=require('express');


const {  createNewSupplier } = require('../controllers/supplierController');


const router=express.Router();


router.post('/createnewsupplier',createNewSupplier);




module.exports=router;