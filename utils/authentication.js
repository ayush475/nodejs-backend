

const ErrorHandler = require("../errorHandler/errorhandler");

exports.isSignedIn=(req,res,next)=>{
    

    const authorizationHeader = req.headers["Authorization"];
    // const token = parseBearer(authorizationHeader);
    console.log(token);
    if(verifytoken(token)){
        next()
    }
    return next(new ErrorHandler(401,"not authorized please sign in"))
  
        
}