const db = require("../config/database");
const cloudinary = require("cloudinary");
const path = require("path");

const ErrorHandler = require("../errorHandler/errorhandler");
const {
  createSupplierTableIfNotExist,
} = require("./creationTables/supplierCreation");
const { createProductTableIfNotExist } = require("./creationTables/productCreation");

exports.createNewProduct = async (req, res, next) => {
  const {
    name,
    category,
    brand,
    productDescription,
    price,
    customDuty,
    vat,
    supplierId,
    productImage
  } = req.body;

  const defaultProductImage = path.join(
    __dirname,
    "../defaultImages/defaultProductImage.jpg"
  );
  const productImageUpload= productImage || defaultProductImage;

  console.log(defaultProductImage, "llm");
  const mycloud = await cloudinary.v2.uploader.upload(productImageUpload, {
    folder: "tech-pasal-inventory-management/products",
    width: 400,
    height: 450,
    quality: 100,
    crop: "scale",
  });

  const productImageJson = {
    public_id: mycloud.public_id,
    image_url: mycloud.secure_url,
  };
  console.log(productImageJson);
  // create
  createProductTableIfNotExist()
    .then((result) => {
      if (result) {
        // insert values into supplier
        console.log(result, "sssssssssss");
        var sqlQuery = `Insert  into Product(name,category,brand,productDescription,price,customDuty,vat,supplierId,productImage) 
      values('${name}',
      '${category}',
      '${brand}',
      '${productDescription}',
      '${price}',
      '${customDuty}',
      '${vat}',
      '${supplierId}',
      '${`{"public_id":"${productImageJson.public_id}","image_url":"${productImageJson.image_url}"}`}'
      );`;

        console.log(sqlQuery);

        db.query(sqlQuery, function (err, result, fields) {
          if (err) {
            return next(new ErrorHandler(400, err.code));
          }
          // console.log();//json.parse  used
          return res
            .status(200)
            .json({ sucess: true, message: `product ${name} created` });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(400, err.code));
    });
};

exports.updateProductDetails = async (req, res, next) => {
  const { productId } = req.params;
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

  var sqlQuery = `update product ${finalUpdatedQuery} where productId=${productId};`;
    console.log(sqlQuery);

  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "product not found"));
    }
    return res
      .status(200)
      .json({ sucess: true, message: `product details updated sucessfully` });
  });
};

exports.deleteProduct= async (req, res, next) => {
  const { productId } = req.params;
  

  var sqlQuery=` update Product set deletedDate=now() where productId=${productId};`
 
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "product not found"));
    }
    return res
      .status(200)
      .json({ sucess: true, message: `product deleted  sucessfully` });
  });
};


exports.deleteProductTable = async (req, res, next) => {
  var sqldropTriggerQuery = `drop trigger beforeProductUpdate;`;
  var sqldropUpdateTableQuery = `drop table ProductUpdate;`;
  var sqldropTableQuery = `drop table Product;`;

  db.query(
    `${sqldropTriggerQuery} ${sqldropUpdateTableQuery} ${sqldropTableQuery}`,
    function (err, result, fields) {
      if (err) {
        return next(new ErrorHandler(400, err.code));
      }
      // console.log();//json.parse  used
      return res
        .status(200)
        .json({
          sucess: true,
          message: `product table ,its update table and before update trigger deleted sucessfully`,
        });
    }
  );
};
