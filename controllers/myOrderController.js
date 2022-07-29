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
const { convertToMySqlDateTime, getVatFromProduct, getCustomDutyFromProduct, getEachPriceFromProduct } = require("./creationTables/commonCreation");

// to create table in database

exports.createNewMyOrder = async (req, res, next) => {
  const { productId, quantity } = req.body;

  // write functio to ger tproice each and ductum duty from obtained productId
  const eachPrice = await getEachPriceFromProduct(productId);
  const customDuty = await getCustomDutyFromProduct(productId);


  let expectedDeliveryDate=new Date();
  console.log(expectedDeliveryDate);

    // expected delivery date set to 30 days from now
  //converting javascritp date to sql date time
   expectedDeliveryDate.setDate(expectedDeliveryDate.getDate()+30);
   expectedDeliveryDate= await convertToMySqlDateTime(expectedDeliveryDate);



 



  createMyOrderTableIfNotExist()
    .then((result) => {
      if (result) {
        // insert values into supplier
        console.log(result, "sssssssssss");

        var sqlQuery = ` Insert into MYOrder(productId,quantity,eachPrice,customDuty,expectedDeliveryDate) 
  values(
"${productId}",
   "${quantity}",
   "${eachPrice}",
  "${customDuty}",
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
            .json({ sucess: true, message: `Import order placed sucessfully` });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(400, err.code));
    });
};

exports.updateMyOrderDetails = async (req, res, next) => {
  const { myOrderId } = req.params;
  var updateData = req.body;

  // set update block of query from request which are defined
  var updateBlockQuery = "set ";
  Object.keys(updateData).forEach((key) => {
    if (
      updateData[key] !== null &&
      updateData[key] !== "" &&
      updateData[key] != undefined
    ) {
     
     
        updateBlockQuery += `${key}='${updateData[key]}',`;
      
    }
  });

  // remove comma from last key paramerter
  // console.log(updateBlockQuery.length);
  var finalUpdatedQuery = await updateBlockQuery.slice(0, -1);

  // var onlyUpdateQuery= req.body.filter(function(x) { return x !== null });

  // console.log(updateBlockQuery);

  var sqlQuery = `update myOrder ${finalUpdatedQuery} where myOrderId=${myOrderId};`;
  console.log(sqlQuery);

  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "import order not found"));
    }
    return res
      .status(200)
      .json({ sucess: true, message: `import  details updated sucessfully` });
  });
};

exports.cancelMyOrder = async (req, res, next) => {
  const { myOrderId } = req.params;

  var sqlQuery = ` update MyOrder set myOrderStatus="cancelled",cancelledDate=Now() where myOrderId=${myOrderId};`;

  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "import order not found"));
    }
    return res
      .status(200)
      .json({ sucess: true, message: `import order cancelled  sucessfully` });
  });
};

exports.getImportShippedOrProcessingOrdersList = async (req, res, next) => {
 
  var sqlQuery=`select ((p.price*(1+p.customDuty/100))*o.quantity)as totalPrice, myOrderId,p.name as productName,p.productId,s.supplierId,p.productImage,s.name as supplierName,supplierImage,
  quantity,myOrderStatus,orderedDate,paymentStatus
  from myorder as o
  inner join 
  product as p
  inner join 
  supplier as s
  where(
  o.productId=p.productId
  and
  p.supplierId=s.supplierId)
  and 
  (
  o.myOrderStatus="processing"
  or o.myOrderStatus="shipped"
  );`;
 
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "import orders not found"));
    }
    return res
      .status(200)
      .json({ sucess: true,data:result });
  });
};