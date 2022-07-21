const db = require("../config/database");
const ErrorHandler = require("../errorHandler/errorhandler");
const { getHashedPassword } = require("../utils/checkCredential");

// to create table in database
exports.createCustomerTable = (req, res, next) => {
  var sqlQuery = `create table Customer(customerId integer auto_increment unique not null primary key ,
    email varchar(50) unique not null,
    password varchar(255) not null,
    name varchar(50) not null,
    customerType varchar(20) not null,
    state varchar(50) not null,
    city varchar(50) not null,
    street varchar(50) not null,
    contactNo varchar(10) not null,
    profileImage json,
    shippingAddress varchar(255) default null,
    openedDate datetime default null,
    closedDate datetime default null
    );`;
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    return res
      .status(200)
      .json({ sucess: true, message: "table customer created sucessfuly" });
  });
};

exports.dropCustomerTable = (req, res, next) => {
  var sqlQuery = `drop table customer`;
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    return res
      .status(200)
      .json({ sucess: true, message: "table customer dropped sucessfully" });
  });
};

exports.createNewCustomer = async(req, res, next) => {
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

  const hashedPassword= await getHashedPassword(password);

  var sqlQuery = `insert into customer(email,password,name,customerType,state,city,street,contactNo,profileImage,openedDate) 
   values(
"${email}",
    "${hashedPassword}",
    "${name}",
   "${customerType}",
    "${state}",
    "${city}",
    "${street}",
    "${contactNo}",
    ${profileImage},
    ${null}
  );`;

  // console.log(hashedPassword,"fff");
  db.query(sqlQuery, function (err, result, fields) {
    if (err){
      return next(new ErrorHandler(400,err.code))
    };
    // console.log();//json.parse  used
    return res.status(200).json({sucess:true,message:`user with email ${email} created`});
  });
};

exports.getAllCustomers = (req, res, next) => {
  const { limit } = req.body;
  var sqlQuery = `Select* from customer limit ${limit}`;
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(404, err.code));
    }
    // console.log();//json.parse  used
   
        return res.status(200).json(result);
  });
};
