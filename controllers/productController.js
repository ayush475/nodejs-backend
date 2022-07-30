const db = require("../config/database");
const cloudinary = require("cloudinary");
const path = require("path");

const ErrorHandler = require("../errorHandler/errorhandler");
const {
  createSupplierTableIfNotExist,
} = require("./creationTables/supplierCreation");
const { createProductTableIfNotExist } = require("./creationTables/productCreation");
const { getVatFromCategory, getCustomDutyFromCategory } = require("./creationTables/commonCreation");

exports.createNewProduct = async (req, res, next) => {
  const {
    name,
    category,
    brand,
    productDescription,
    price,
    supplierId,
    productImage
  } = req.body;

  const vat= await getVatFromCategory(category);
  const customDuty=await getCustomDutyFromCategory(category);

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
  

  var sqlQuery=`update product set deletedDate=now(),productStatus="deleted" where productId=${productId};`
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
      .json({ sucess: true, message: `product deleted  sucessfully` });
  });
};


exports.getProductDetailsForStore = async (req, res, next) => {
var sqlQuery=`select name,brand ,price,productImage,productId from Product where productStatus="published";`;
  db.query(
    sqlQuery,
    function (err, result, fields) {
      if (err) {
        return next(new ErrorHandler(400, err.code));
      }
      // console.log();//json.parse  used
      return res
        .status(200)
        .json({
          sucess: true,
          data:result,
        });
    }
  );
};


exports.getProductFullDetailsForOrder = async (req, res, next) => {
  const {productId}=req.params;
  var sqlQuery=`select name,brand,productId ,price,category,stock,productDescription ,productImage,vat from Product where productId=${productId};`;
    db.query(
      sqlQuery,
      function (err, result, fields) {
        if (err) {
          return next(new ErrorHandler(400, err.code));
        }
        // console.log();//json.parse  used
        return res
          .status(200)
          .json({
            sucess: true,
            data:result,
          });
      }
    );
  };



  exports.getAllProductsForImport = async (req, res, next) => {
    var sqlQuery=`select productId,name,brand,supplierId,price,customDuty,productDescription,productImage from product where productStatus != "deleted";`;
      db.query(
        sqlQuery,
        function (err, result, fields) {
          if (err) {
            return next(new ErrorHandler(400, err.code));
          }
          // console.log();//json.parse  used
          return res
            .status(200)
            .json({
              sucess: true,
              data:result,
            });
        }
      );
    };



    exports.getProductNameAndImage = async (req, res, next) => {
 
      const {productId}=req.params;
    
      var sqlQuery=`select name,productImage,productId from product where productId=${productId};`;
     
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
          .json({ sucess: true,data:result });
      });
    };









    exports.getPublishedOrUnpublishedProductList = async (req, res, next) => {
 
      var sqlQuery=`select p.name as productName,p.productId,s.supplierId,p.productImage,s.name as supplierName,supplierImage,
      stock,productStatus,category,price
      from product as p
      inner join 
      supplier as s
      where
      p.supplierId=s.supplierId
      and 
      (
      p.productStatus="published"
      or
      p.productStatus="unpublished"
      );`;
     
      db.query(sqlQuery, function (err, result, fields) {
        if (err) {
          return next(new ErrorHandler(400, err.code));
        }
        // console.log();//json.parse  used
        console.log(result.info);
        if (result.affectedRows == 0) {
          return next(new ErrorHandler(404, "products not found"));
        }
        return res
          .status(200)
          .json({ sucess: true,data:result });
      });
    };
    
    
    
    exports.getProductListByFilter = async (req, res, next) => {
     
      const {productstatus}=req.query;
    
      var sqlQuery=`select p.name as productName,p.productId,s.supplierId,p.productImage,s.name as supplierName,supplierImage,
      stock,productStatus,category,price
      from product as p
      inner join 
      supplier as s
      where
      p.supplierId=s.supplierId
      and 
      (
      p.productStatus="${productstatus}"
      );`;
      console.log(sqlQuery);
     
      db.query(sqlQuery, function (err, result, fields) {
        if (err) {
          return next(new ErrorHandler(400, err.code));
        }
        // console.log();//json.parse  used
        console.log(result.info);
        if (result.affectedRows == 0) {
          return next(new ErrorHandler(404, "products orders not found"));
        }
        return res
          .status(200)
          .json({ sucess: true,data:result });
      });
    };