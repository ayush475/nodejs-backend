const db = require("../config/database");

const ErrorHandler = require("../errorHandler/errorhandler");
const { createSupplierTableIfNotExist } = require("./creationTables/supplierCreation");

exports.createNewSupplier = (req, res, next) => {
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
  } = req.body;
  console.log(req.body.name);

  // create
  createSupplierTableIfNotExist()
    .then((result) => {
      if (result) {
        // insert values into supplier
        console.log(result, "sssssssssss");
        var sqlQuery = `Insert  into Supplier(name,email,country,state,city,street,pinCode,poBox,supplierDetails,supplierImage) 
      values('${name}',
      '${email}',
      '${country}',
      '${state}',
      '${city}',
      '${street}',
      '${pinCode}',
      '${poBox}',
      '${supplierDetails}',
      '${supplierImage}'
      );`;

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
      return next( new ErrorHandler(400, err.code));
    });
};


// exports.updateSupplierDetails = (req, res, next) => {
//   const {
//     supplierId,
//     name,
//     email,
//     country,
//     state,
//     city,
//     street,
//     pinCode,
//     poBox,
//     supplierDetails,
    
//   } = req.body;
 

//   // create
//   createSupplierUpdateTableIfNotExist()
//     .then((result) => {
//       if (result) {
//         // insert values into supplier
//         var sqlQuery = `Insert  into Supplier(name,email,country,state,city,street,pinCode,poBox,supplierDetails,supplierImage) 
//       values('${name}',
//       '${email}',
//       '${country}',
//       '${state}',
//       '${city}',
//       '${street}',
//       '${pinCode}',
//       '${poBox}',
//       '${supplierDetails}',
//       '${supplierImage}'
//       );`;

//         db.query(sqlQuery, function (err, result, fields) {
//           if (err) {
//             return next(new ErrorHandler(400, err.code));
//           }
//           // console.log();//json.parse  used
//           return res
//             .status(200)
//             .json({ sucess: true, message: `supplier ${""} created` });
//         });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       return next(ErrorHandler(400, err.code));
//     });
// };



        
  


