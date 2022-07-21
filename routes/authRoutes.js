const express=require('express');
const { login } = require('../controllers/authController');

const {isSignedIn}=require('../utils/authentication')


const router=express.Router();

// root allert 
router.get('/customer/login',isSignedIn,login);



module.exports=router;