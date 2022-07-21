const express=require('express');
const { getAllCustomers, createCustomerTable, dropCustomerTable, createNewCustomer } = require('../controllers/customerController');

const router=express.Router();

// root allert 
router.post('/createcustomertable',createCustomerTable);
router.delete('/dropCustomerTable',dropCustomerTable);


// customers
router.post('/createnewcustomer',createNewCustomer);


router.get('/customers',getAllCustomers);


module.exports=router;