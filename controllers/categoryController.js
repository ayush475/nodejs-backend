const db = require("../config/database");
const cloudinary = require("cloudinary");
const path = require("path");

const ErrorHandler = require("../errorHandler/errorhandler");
const {
  createCategoryTableIfNotExist,
} = require("./creationTables/categoryCreation");
const { createProductTableIfNotExist } = require("./creationTables/productCreation");

exports.createNewCategory = async (req, res, next) => {
  const {
    name,
    profit,
    vat,
    customDuty
  } = req.body;

 


  // create
  createCategoryTableIfNotExist()
    .then((result) => {
      if (result) {
        // insert values into supplier
        console.log(result, "sssssssssss");
        var sqlQuery = `Insert  into Category(name,profit,vat,customDuty) 
      values('${name}',
      '${profit}',
      '${vat}',
      '${customDuty}'
      );`;

        console.log(sqlQuery);

        db.query(sqlQuery, function (err, result, fields) {
          if (err) {
            return next(new ErrorHandler(400, err.code));
          }
          // console.log();//json.parse  used
          return res
            .status(200)
            .json({ sucess: true, message: `category ${name} created` });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(400, err.code));
    });
};

exports.updateCategoryDetails = async (req, res, next) => {
  const { categoryId } = req.params;
  var updateData = req.body;

  // set update block of query from request which are defined
  var updateBlockQuery = "set ";
  Object.keys(updateData).forEach((key) => {
    if (
      updateData[key] !== null &&
      updateData[key] !== "" &&
      updateData[key] != undefined
    ) {
      typeof(updateData[key])
      updateBlockQuery += `${key}='${updateData[key]}',`;
    }
  });

  // remove comma from last key paramerter
  // console.log(updateBlockQuery.length);
  var finalUpdatedQuery = await updateBlockQuery.slice(0, -1);

  // var onlyUpdateQuery= req.body.filter(function(x) { return x !== null });

  // console.log(updateBlockQuery);

  var sqlQuery = `update category ${finalUpdatedQuery} where categoryId=${categoryId};`;
    console.log(sqlQuery);

  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "category not found"));
    }
    return res
      .status(200)
      .json({ sucess: true, message: `category details updated sucessfully` });
  });
};

exports.deleteCategory= async (req, res, next) => {
  const { categoryId } = req.params;
  

  var sqlQuery=` update Category set removedDate=now() where categoryId=${categoryId};`
 
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "category not found"));
    }
    return res
      .status(200)
      .json({ sucess: true, message: `category deleted  sucessfully` });
  });
};


exports.deleteCategoryTable = async (req, res, next) => {
  var sqldropTriggerQuery = `drop trigger beforeCategoryUpdate;`;
  var sqldropUpdateTableQuery = `drop table CategoryUpdate;`;
  var sqldropTableQuery = `drop table Category;`;

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
          message: `category table ,its update table and before update trigger deleted sucessfully`,
        });
    }
  );
};


exports.getAllActiveCategory= async (req, res, next) => {

  

  var sqlQuery=`select categoryId,name from category where removedDate is  null ;`
 
  db.query(sqlQuery, function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
    // console.log();//json.parse  used
    console.log(result.info);
    if (result.affectedRows == 0) {
      return next(new ErrorHandler(404, "categories not found"));
    }
    return res
      .status(200)
      .json({ sucess: true, data:result });
  });
};