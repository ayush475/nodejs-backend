const express=require('express');
const { deleteCategoryTable, createNewCategory, updateCategoryDetails, deleteCategory, getAllCategory, getAllActiveCategory, getCompleteCategoriesDetails } = require('../controllers/categoryController');



const router=express.Router();



// danger
router.delete('/delete/categorytable',deleteCategoryTable);



router.post('/createnewcategory',createNewCategory);
router.put('/update/category/:categoryId',updateCategoryDetails);
router.put('/delete/category/:categoryId',deleteCategory);
router.get('/allcategories',getAllActiveCategory);
router.get('/categories/details',getCompleteCategoriesDetails);

module.exports=router;