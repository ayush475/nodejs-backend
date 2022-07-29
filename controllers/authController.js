const db = require("../config/database");
const ErrorHandler = require("../errorHandler/errorhandler");
const { getHashedPassword, comparePassword, generateToken } = require("../utils/checkCredential");

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  console.log(email);
  var sqlQuery = `select email,password,customerId,role from customer where email="${email}"`;
  db.query(sqlQuery,async function (err, result, fields) {
    if (err) {
      return next(new ErrorHandler(400, err.code));
    }
     console.log(result);//json.parse  used
    //  console.log(password,result[0].password);

    if(result.length==0){
      next(new ErrorHandler(404,"email doesnot exist"))
    }
    if(result.length==1){
      const isAuthenticated= await comparePassword(password,result[0].password);
      console.log(isAuthenticated);
      if(isAuthenticated){
        const token =await generateToken(result[0].customerId,result[0].email,result[0].role);
        console.log(token);
        return res.status(200).json({sucess:true, token:token ,role:result[0].role,message:"login sucessful"});

      }else{
      return  next(new ErrorHandler(400,"password and email doesnot match"))
      }
    }
   
  });
};
