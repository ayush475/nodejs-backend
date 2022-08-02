const ErrorHandler = require("../errorHandler/errorhandler");
const { verifytoken } = require("./checkCredential");

exports.isSignedIn = async (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  console.log(authorizationHeader);

  if ( authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    const token = authorizationHeader.substring(7, authorizationHeader.length);
    const decodedData = await verifytoken(token);

    if (decodedData) {
      // console.log(decodedData);
      req.user = decodedData; // user prrperty is added to req if token is verified
      return next();
    } else {
      next(new ErrorHandler(400, "invalid token"));
    }
  }

  return next(new ErrorHandler(401, "not authorized please sign in"));
};


exports.isAdmin= async (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  console.log(authorizationHeader);

  if ( authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    const token = authorizationHeader.substring(7, authorizationHeader.length);
    const decodedData = await verifytoken(token);

    if (decodedData) {
      // console.log(decodedData);
    
       // user prrperty is added to req if token is verified

       if(decodedData.role==="admin"){
        req.user = decodedData;
       }else{
     return   next(new ErrorHandler(400, "you are not authorized to perform this action"));
       }
      return next();
    } else {
      next(new ErrorHandler(400, "invalid token"));
    }
  }

  return next(new ErrorHandler(401, "not authorized please sign in"));
};
