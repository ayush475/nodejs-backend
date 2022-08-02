const db = require("../config/database");
const cloudinary = require("cloudinary");
const path = require("path");

const ErrorHandler = require("../errorHandler/errorhandler");
const { getHashedPassword } = require("../utils/checkCredential");
const {
  createCustomerTableIfNotExist,
} = require("./creationTables/customerCreation");

// to create table in database

exports.createNewCustomer = async (req, res, next) => {
  const {
    email,
    password,
    name,
    customerType,
    state,
    city,
    street,
    contactNo,
    profileImage,
  } = req.body;

  const hashedPassword = await getHashedPassword(password);

  const defaultcustomerImage = path.join(
    __dirname,
    "../defaultImages/defaultCustomerImage.jpg"
  );
  const customerImageUpload = profileImage || defaultcustomerImage;

  console.log(defaultcustomerImage, "llm");
  const mycloud = await cloudinary.v2.uploader.upload(customerImageUpload, {
    folder: "tech-pasal-inventory-management/customers",
    width: 400,
    height: 450,
    quality: 100,
    crop: "scale",
  });

  const customerImageJson = {
    public_id: mycloud.public_id,
    image_url: mycloud.secure_url,
  };
  console.log(customerImageJson);
  // create

  createCustomerTableIfNotExist()
    .then((result) => {
      if (result) {
        // insert values into supplier
        console.log(result, "sssssssssss");

        var sqlQuery = `insert into customer(email,password,name,customerType,state,city,street,contactNo,profileImage) 
  values(
"${email}",
   "${hashedPassword}",
   "${name}",
  "${customerType}",
   "${state}",
   "${city}",
   "${street}",
   "${contactNo}",
   '${`{"public_id":"${customerImageJson.public_id}","image_url":"${customerImageJson.image_url}"}`}'
 );`;

        // console.log(hashedPassword,"fff");
        db.query(sqlQuery, function (err, result, fields) {
          if (err) {
            return next(new ErrorHandler(400, err.code));
          }
          // console.log();//json.parse  used
          return res
            .status(200)
            .json({
              sucess: true,
              message: `user with email ${email} created`,
            });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(400, err.code));
    });
};

exports.updateCustomerDetails = async (req, res, next) => {
  const { customerId } = req.params;
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
      if (key !== "password") {
        updateBlockQuery += `${key}='${updateData[key]}',`;
      }
    }
  });

  // remove comma from last key paramerter
  // console.log(updateBlockQuery.length);
  var finalUpdatedQuery = await updateBlockQuery.slice(0, -1);

  // var onlyUpdateQuery= req.body.filter(function(x) { return x !== null });

  // console.log(updateBlockQuery);

  var sqlQuery = `update customer ${finalUpdatedQuery} where customerId=${customerId};`;
  console.log(sqlQuery);

  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "customer not found"));
    }
    return res
      .status(200)
      .json({ sucess: true, message: `customer details updated sucessfully` });
  });
};

exports.deleteCustomer = async (req, res, next) => {
  const { customerId } = req.params;

  var sqlQuery = ` update Customer set closedDate=now() where customerId=${customerId};`;

  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "customer not found"));
    }
    return res
      .status(200)
      .json({ sucess: true, message: `customer deleted  sucessfully` });
  });
};

exports.deleteCustomerTable = async (req, res, next) => {
  var sqldropTriggerQuery = `drop trigger beforeCustomerUpdate;`;
  var sqldropUpdateTableQuery = `drop table CustomerUpdate;`;
  var sqldropTableQuery = `drop table Customer;`;

  db.query(
    `${sqldropTriggerQuery} ${sqldropUpdateTableQuery} ${sqldropTableQuery}`,
    function (err, result, fields) {
      if (err) {
        return next(new ErrorHandler(400, err.code));
      }
      // console.log();//json.parse  used
      return res.status(200).json({
        sucess: true,
        message: `customer table ,its update table and before update trigger deleted sucessfully`,
      });
    }
  );
};

exports.getCustomerLists = async (req, res, next) => {
  var sqlQuery = `select customerId,email,name,customerType,state,city,street,contactNo,profileImage from customer where closedDate is null;`;

  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "customers not found"));
    }
    return res.status(200).json({ sucess: true, data: result });
  });
};

exports.getCustomerTotalCount = async (req, res, next) => {
  var sqlQuery = `select count(*) as customerCount from customer where closedDate is null;`;

  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "customers not found"));
    }
    return res.status(200).json({ sucess: true, data: result });
  });
};

exports.getCustomerCompleteDetails = async (req, res, next) => {

  const {customerId}=req.params;
  var sqlQuery = `select customerId,email,name,customerType,state,
  street,city,contactNo,profileImage,role,shippingAddress,
  openedDate,closedDate from customer where customerId=${customerId};`;

  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "customers not found"));
    }
    return res.status(200).json({ sucess: true, data: result });
  });
};


exports.getCustomerNameAndProfileImage= async (req, res, next) => {
const {email}=req.body;
  var sqlQuery = `select name,profileImage,customerId from customer where email="${email}";`;

  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "customers not found"));
    }
    return res.status(200).json({ sucess: true, data: result });
  });
};