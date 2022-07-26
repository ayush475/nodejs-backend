const express=require('express');
const { createCategoryTable, dropCategoryTable } = require('../controllers/categoryController');

const router=express.Router();


router.put('/createcategorytable',createCategoryTable);
router.delete('/dropcategorytable',dropCategoryTable);


module.exports=router;