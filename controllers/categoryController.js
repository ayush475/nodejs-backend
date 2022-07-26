const db = require("../config/database");
const ErrorHandler = require("../errorHandler/errorhandler");


exports.createCategoryTable=(req,res,next)=>{
  
var sqlQuery=`create table Category(categoryId int auto_increment unique not null primary key,
    name  varchar(50)  not null unique,
    profitMargin int  not null,
    addedDate datetime default now(),
    removedDate datetime default null
    );`

    db.query(sqlQuery, function (err, result, fields) {
        if (err) {
          return next(new ErrorHandler(400, err.code));
        }
        // console.log();//json.parse  used
        return res
          .status(200)
          .json({ sucess: true, message: `category Table  created` });
      });
}



exports.dropCategoryTable=(req,res,next)=>{
  
    var sqlQuery=`drop table Category;`
    
        db.query(sqlQuery, function (err, result, fields) {
            if (err) {
              return next(new ErrorHandler(400, err.code));
            }
            // console.log();//json.parse  used
            return res
              .status(200)
              .json({ sucess: true, message: `category Table  dropped` });
          });
    }