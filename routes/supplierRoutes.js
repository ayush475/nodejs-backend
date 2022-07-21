const express=require('express');

const { getAllSuppliers } = require('../controllers/supplierController');


const router=express.Router();


router.get('/suppliers',getAllSuppliers);


module.exports=router;