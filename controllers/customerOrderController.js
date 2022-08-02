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
const { convertToMySqlDateTime, getVatFromProduct, getEachPriceFromProduct, getProfitFromCategoryByProductId } = require("./creationTables/commonCreation");
const { createCustomerOrderTableIfNotExist } = require("./creationTables/customerOrderCreation");

// to create table in database

exports.createNewCustomerOrder = async (req, res, next) => {
  const { productId, quantity } = req.body;
  // console.log(req.user.customerId);
  const customerId=req.user.customerId;

  // write functio to ger tproice each and ductum duty from obtained productId
  const eachPrice = await getEachPriceFromProduct(productId);
  const vat = await getVatFromProduct(productId);
  const profit = await getProfitFromCategoryByProductId(productId);


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

        var sqlQuery = ` Insert into CustomerOrder(productId,customerId,quantity,eachPrice,vat,profit,expectedDeliveryDate) 
  values(
"${productId}",
"${customerId}",
   "${quantity}",
   "${eachPrice}",
  "${vat}",
  "${profit}",
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
  var sqlQuery;
  if(updateData.orderStatus && updateData.orderStatus=="Delivered"){
    console.log('delivered');
     sqlQuery=`call  decreaseProductStockOnCustomerDelivery(${customerOrderId});`
  }else{
   sqlQuery = `update CustomerOrder ${finalUpdatedQuery} where orderId=${customerOrderId};`;
  }
  console.log(updateData);
console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
console.log(sqlQuery);


 
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




exports.getCustomerOrderShippedOrProcessingOrdersList = async (req, res, next) => {
 
  var sqlQuery=`select (p.price*(1+o.profit/100)*(1+customDuty/100)*(1+p.vat/100))as totalPrice, orderId,p.name as productName,p.productId,c.customerId,p.productImage,c.name as customerName,c.profileImage as customerImage,
  quantity,orderStatus,orderedDate,paymentStatus,city,state,street
  from customerOrder as o
  inner join 
  product as p
  inner join  customer as c
  where(
  o.productId=p.productId
  and 
  o.customerId=c.customerId
  )
  and
  (
  o.orderStatus="shipped"
  or
   o.orderStatus="processing"
  );
    `;
 
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "customer orders not found"));
    }
    return res
      .status(200)
      .json({ sucess: true,data:result });
  });
};



exports.getCustomerOrdersListByFilter = async (req, res, next) => {
 
  const {orderstatus}=req.query;

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
  o.myOrderStatus="${orderstatus}"
  );`;

  var sqlQuery=`select ((p.price*(1+p.vat/100))*o.quantity)as totalPrice, orderId,p.name as productName,p.productId,c.customerId,p.productImage,c.name as customerName,c.profileImage as customerImage,
  quantity,orderStatus,orderedDate,paymentStatus
  from customerOrder as o
  inner join 
  product as p
  inner join  customer as c
  where(
  o.productId=p.productId
  and 
  o.customerId=c.customerId
  )
  and
  (
  o.orderStatus="${orderstatus}"

  );
    `
  console.log(sqlQuery);
 
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


exports.getCustomerOrderTotalCount= async (req, res, next) => {
 
  var sqlQuery=`  select count(*) as salesCount  from CustomerOrder where orderStatus="delivered"`
 
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "customer orders not found"));
    }
    return res
      .status(200)
      .json({ sucess: true,data:result });
  });
};




exports.getTotalRevenue= async (req, res, next) => {
 
  var sqlQuery=`select sum(o.eachPrice*o.quantity*(1+o.profit/100)*(1+p.customDuty/100))as revenue from CustomerOrder as o
  inner join product as p
   where orderStatus="delivered"
   and o.productId=p.productId
   ;`;

  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "customer orders not found"));
    }
    return res
      .status(200)
      .json({ sucess: true,data:result });
  });
};

exports.getTotalProfit= async (req, res, next) => {
 
  var sqlQuery=` select sum(eachPrice*profit/100)as profit from CustomerOrder 
  where orderStatus="delivered";`;
   
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "customer orders not found"));
    }
    return res
      .status(200)
      .json({ sucess: true,data:result });
  });
};

exports.getTopSales= async (req, res, next) => {
 
  var sqlQuery=`select ((p.price*(1+p.vat/100))*o.quantity)as totalPrice, orderId,p.name as productName,p.productId,c.customerId,p.productImage,c.name as customerName,c.profileImage as customerImage,       
  quantity,orderStatus,date(orderedDate) as orderedDate,paymentStatus,c.email as customerEmail
  from customerOrder as o
  inner join 
  product as p
  inner join  customer as c
  where(
  o.productId=p.productId
  and 
  o.customerId=c.customerId
  )
  and
  (
  o.orderStatus="processing"
  or 
  o.orderStatus="shipped"
  )
  order By quantity desc limit 4;`
 
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "customer orders not found"));
    }
    return res
      .status(200)
      .json({ sucess: true,data:result });
  });
};



exports.getCustomerOrderCompleteDetails= async (req, res, next) => {
 const {orderId}=req.params;
  var sqlQuery=`select *,p.name as productName,productImage,brand,category,c.name as customerName,
  c.profileImage as customerImage,
  c.email as customerEmail,c.contactNo as customerContactNo,
    c.street as customerStreet,c.city as customerCity,c.state as customerState,
    s.name as supplierName,supplierImage
    from customerOrder as o
    inner join product as p
    inner join customer as c
    inner join supplier as s
    where(
    o.productId=p.productId
    and 
    p.supplierId=s.supplierId
    )
    and
    o.customerId=c.customerId
    and o.orderId=${orderId};`;
 
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "customer orders not found"));
    }
    return res
      .status(200)
      .json({ sucess: true,data:result });
  });
};
