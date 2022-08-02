const db = require("../config/database");
const ErrorHandler = require("../errorHandler/errorhandler");
const { getHashedPassword, comparePassword, generateToken } = require("../utils/checkCredential");

exports.getOutOFStockProducts = (req, res, next) => {

  var sqlQuery = `select name as productName ,productId from  product where stock=0;`;
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




exports.getLowStockProducts= (req, res, next) => {

  var sqlQuery = `select name as productName ,productId,stock from  product where stock<10 and stock>0;`;
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
