const db = require("../config/database");
const cloudinary = require("cloudinary");
const path = require("path");

const ErrorHandler = require("../errorHandler/errorhandler");
const { getHashedPassword } = require("../utils/checkCredential");
const {
  createCustomerTableIfNotExist,
} = require("./creationTables/customerCreation");
const {
  createMyOrderTableIfNotExist,
} = require("./creationTables/myOrderCreation");
const { convertToMySqlDateTime, getVatFromProduct, getEachPriceFromProduct } = require("./creationTables/commonCreation");
const { createCustomerOrderTableIfNotExist } = require("./creationTables/customerOrderCreation");

// to create table in database

exports.createNewCustomerOrder = async (req, res, next) => {
  const { productId, quantity } = req.body;
  // console.log(req.user.customerId);
  const customerId=req.user.customerId;

  // write functio to ger tproice each and ductum duty from obtained productId
  const eachPrice = await getEachPriceFromProduct(productId);
  const vat = await getVatFromProduct(productId);


  let expectedDeliveryDate=new Date();
  console.log(expectedDeliveryDate);

    // expected delivery date set to 30 days from now
  //converting javascritp date to sql date time
   expectedDeliveryDate.setDate(expectedDeliveryDate.getDate()+30);
   expectedDeliveryDate= await convertToMySqlDateTime(expectedDeliveryDate);



 



  createCustomerOrderTableIfNotExist()
    .then((result) => {
      if (result) {
        // insert values into supplier
        console.log(result, "sssssssssss");

        var sqlQuery = ` Insert into CustomerOrder(productId,customerId,quantity,eachPrice,vat,expectedDeliveryDate) 
  values(
"${productId}",
"${customerId}",
   "${quantity}",
   "${eachPrice}",
  "${vat}",
  "${expectedDeliveryDate}");`;

  console.log(sqlQuery);

        // console.log(hashedPassword,"fff");
        db.query(sqlQuery, function (err, result, fields) {
          if (err) {
            return next(new ErrorHandler(400, err.code));
          }
          // console.log();//json.parse  used
          return res
            .status(200)
            .json({ sucess: true, message: ` order placed sucessfully` });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(400, err.code));
    });
};

exports.updateCustomerOrderDetails = async (req, res, next) => {
  const { customerOrderId } = req.params;
  var updateData = req.body;

  // set update block of query from request which are defined
  var updateBlockQuery = "set ";
  Object.keys(updateData).forEach((key) => {
    if (
      updateData[key] !== null &&
      updateData[key] !== "" &&
      updateData[key] != undefined
    ) {
      // skip password key for this update
    
        updateBlockQuery += `${key}='${updateData[key]}',`;
      
    }
  });

  // remove comma from last key paramerter
  // console.log(updateBlockQuery.length);
  var finalUpdatedQuery = await updateBlockQuery.slice(0, -1);

  // var onlyUpdateQuery= req.body.filter(function(x) { return x !== null });

  // console.log(updateBlockQuery);

  var sqlQuery = `update CustomerOrder ${finalUpdatedQuery} where orderId=${customerOrderId};`;
  console.log(sqlQuery);

  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, " order not found"));
    }
    return res
      .status(200)
      .json({ sucess: true, message: `order details updated sucessfully` });
  });
};

exports.cancelCustomerOrder = async (req, res, next) => {
  const {customerOrderId } = req.params;

  var sqlQuery = ` update CustomerOrder set orderStatus="cancelled",cancelledDate=Now() where orderId=${customerOrderId};`;

  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "order not found"));
    }
    return res
      .status(200)
      .json({ sucess: true, message: `order cancelled  sucessfully` });
  });
};

