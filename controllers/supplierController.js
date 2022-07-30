const db = require("../config/database");
const cloudinary = require("cloudinary");
const path = require("path");

const ErrorHandler = require("../errorHandler/errorhandler");
const {
  createSupplierTableIfNotExist,
} = require("./creationTables/supplierCreation");

exports.createNewSupplier = async (req, res, next) => {
  const {
    name,
    email,
    country,
    state,
    city,
    street,
    pinCode,
    poBox,
    supplierDetails,
    supplierImage,
    contactNo
  } = req.body;

  const defaultSupplierImage = path.join(
    __dirname,
    "../defaultImages/defaultSupplierImage.jpg"
  );
  const supplierImageUpload = supplierImage || defaultSupplierImage;

  console.log(defaultSupplierImage, "llm");
  const mycloud = await cloudinary.v2.uploader.upload(supplierImageUpload, {
    folder: "tech-pasal-inventory-management/suppliers",
    width: 400,
    height: 450,
    quality: 100,
    crop: "scale",
  });

  const supplierImageJson = {
    public_id: mycloud.public_id,
    image_url: mycloud.secure_url,
  };
  console.log(supplierImageJson);
  // create
  createSupplierTableIfNotExist()
    .then((result) => {
      if (result) {
        // insert values into supplier
        console.log(result, "sssssssssss");
        var sqlQuery = `Insert  into Supplier(name,email,country,state,city,street,pinCode,poBox,contactNo,supplierDetails,supplierImage) 
      values('${name}',
      '${email}',
      '${country}',
      '${state}',
      '${city}',
      '${street}',
      '${pinCode}',
      '${poBox}',
      '${contactNo}',
      '${supplierDetails}',
      '${`{"public_id":"${supplierImageJson.public_id}","image_url":"${supplierImageJson.image_url}"}`}'
      );`;

        console.log(sqlQuery);

        db.query(sqlQuery, function (err, result, fields) {
          if (err) {
            return next(new ErrorHandler(400, err.code));
          }
          // console.log();//json.parse  used
          return res
            .status(200)
            .json({ sucess: true, message: `supplier ${name} created` });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(400, err.code));
    });
};

exports.updateSupplierDetails = async (req, res, next) => {
  const { supplierId } = req.params;
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

  var sqlQuery = `update supplier ${finalUpdatedQuery} where supplierId=${supplierId};`;
    console.log(sqlQuery);

  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "supplier not found"));
    }
    return res
      .status(200)
      .json({ sucess: true, message: `supplier details updated sucessfully` });
  });
};

exports.deleteSupplier = async (req, res, next) => {
  const { supplierId } = req.params;
  

  var sqlQuery=` update Supplier set removedDate=now() where supplierId=${supplierId};`
 
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "supplier not found"));
    }
    return res
      .status(200)
      .json({ sucess: true, message: `supplier deleted  sucessfully` });
  });
};


exports.deleteSupplierTable = async (req, res, next) => {
  var sqldropTriggerQuery = `drop trigger beforeSupplierUpdate;`;
  var sqldropSupplierUpdateTableQuery = `drop table supplierUpdate;`;
  var sqldropSupplierTableQuery = `drop table supplier;`;

  db.query(
    `${sqldropTriggerQuery} ${sqldropSupplierUpdateTableQuery} ${sqldropSupplierTableQuery}`,
    function (err, result, fields) {
      if (err) {
        return next(new ErrorHandler(400, err.code));
      }
      // console.log();//json.parse  used
      return res
        .status(200)
        .json({
          sucess: true,
          message: `supplier table ,its update table and before update trigger deleted sucessfully`,
        });
    }
  );
};


exports.getAllActiveSuppliers = async (req, res, next) => {
 
  

  var sqlQuery=`select supplierId,name from  supplier where removedDate is null;`
 
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "supplier not found"));
    }
    return res
      .status(200)
      .json({ sucess: true,data:result });
  });
};


exports.getSupplierNameAndImage = async (req, res, next) => {
 
  const {supplierId}=req.params;

  var sqlQuery=`select name,supplierImage,supplierId from supplier where supplierId=${supplierId};`;
 
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "supplier not found"));
    }
    return res
      .status(200)
      .json({ sucess: true,data:result });
  });
};



exports.getSupplierLists = async (req, res, next) => {
 
  var sqlQuery=`select supplierId,name,country,email,city,state,street,pinCode,poBox,supplierDetails,supplierImage from supplier where removedDate is null;`;
 
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "suppliers not found"));
    }
    return res
      .status(200)
      .json({ sucess: true,data:result });
  });
};