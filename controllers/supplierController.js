const db = require("../config/database");
const cloudinary = require("cloudinary");
const path = require("path");

const ErrorHandler = require("../errorHandler/errorhandler");
const { createSupplierTableIfNotExist } = require("./creationTables/supplierCreation");

exports.createNewSupplier = async(req, res, next) => {
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
  

  const defaultSupplierImage = path.join(__dirname,"../defaultImages/defaultSupplierImage.jpg");
  const supplierImageUpload = supplierImage || defaultSupplierImage;
  
  console.log(defaultSupplierImage,"llm");
  const mycloud = await cloudinary.v2.uploader.upload(supplierImageUpload, {
    folder: "tech-pasal-inventory-management/suppliers",
    width: 400,
    height: 450,
    quality: 100,
    crop: "scale",
  });

  const supplierImageJson={
    public_id: mycloud.public_id,
    image_url: mycloud.secure_url,
  }
console.log(supplierImageJson);
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
      return next( new ErrorHandler(400, err.code));
    });
};


exports.updateSupplierDetails = (req, res, next) => {
  const {supplierId}=req.params;
// console.log(supplierId,"mmmmm");
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
    
  } = req.body;
 

  
      //   var sqlQuery = `update Supplier
      //   set ${name?`name="${name}":" "`}
      //   country="engleand",
      //   supplierDetails="this  is a good supplier"
      //  where supplierId=${supplierId};`;

       console.log(sqlQuery);

        db.query(sqlQuery, function (err, result, fields) {
          if (err) {
            return next(new ErrorHandler(400, err.code));
          }
          // console.log();//json.parse  used
          console.log(result.info);
          if(result.affectedRows==0){
            return next(new ErrorHandler(404, "supplier not found"));
          }
          return res
            .status(200)
            .json({ sucess: true, message: `supplier details updated sucessfully` });
        });
   
};



        
  


