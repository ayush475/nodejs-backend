const express=require('express');
const { deleteCategoryTable, createNewCategory, updateCategoryDetails, deleteCategory } = require('../controllers/categoryController');



const router=express.Router();



// danger
router.delete('/delete/categorytable',deleteCategoryTable);



router.post('/createnewcategory',createNewCategory);
router.put('/update/category/:categoryId',updateCategoryDetails);
router.put('/delete/category/:categoryId',deleteCategory);


module.exports=router;