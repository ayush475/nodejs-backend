const express=require('express');
const { login } = require('../controllers/authController');

const {isSignedIn}=require('../utils/authentication')


const router=express.Router();

// root allert 
router.get('/customer/login',login);



module.exports=router;