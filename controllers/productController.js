const db = require("../config/database");
const ErrorHandler = require("../errorHandler/errorhandler");


// to create table in database
exports.createProductTable = (req, res, next) => {
  var sqlQuery = `create table Product(productId integer auto_increment unique not null primary key ,
    name varchar(50) unique not null,
    category varchar(50) not null,
    brand varchar(20) not null,
    productDescription varchar(255)  not null,
    price integer not null,
    customDuty int4 not null,
    vat int2 not null,
    supplierId  integer  references Supplier(supplierId),
    productImage json,
    createdDate datetime default null,
    deletedDate datetime default null
    );`;
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    return res
      .status(200)
      .json({ sucess: true, message: "table product created sucessfuly" });
  });
};

exports.dropProductTable = (req, res, next) => {
  var sqlQuery = `drop table product`;
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    return res
      .status(200)
      .json({ sucess: true, message: "table product dropped sucessfully" });
  });
};

exports.createNewProduct = async (req, res, next) => {
  const customDuty=40;
  const vat=13;
  const {
    name,
    category,
    brand,
    productDescription,
    price,
    supplierId,
    productImage,
    createdDate,
  } = req.body;



  var sqlQuery = `Insert  into Product(name,category,brand,productDescription,price,customDuty,vat,supplierId,productImage,createdDate) 
   values(
"${name}",
    "${category}",
    "${brand}",
   "${productDescription}",
    "${price}",
    "${customDuty}",
    "${vat}",
    "${supplierId}",
    ${productImage},
    ${null}
  );`;

  // console.log(hashedPassword,"fff");
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    return res
      .status(200)
      .json({ sucess: true, message: `product ${name} created` });
  });
};

exports.getAllProducts = (req, res, next) => {
  const { limit } = req.body;
  var sqlQuery = `Select* from Product limit ${limit}`;
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(404, err.code));
    }
    // console.log();//json.parse  used

    return res.status(200).json(result);
  });
};
