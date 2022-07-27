const bcrypt = require('bcryptjs');

const jwt =require('jsonwebtoken');
const { token } = require('morgan');
const ErrorHandler = require('../errorHandler/errorhandler');


exports.getHashedPassword=async(password)=>{
  var salt = await bcrypt.genSaltSync(10);
 var hash =await bcrypt.hashSync(password, salt);
 return hash;
    
}

exports.comparePassword=async(password,hashedPassword)=>{
  console.log(password,hashedPassword);
 return  await bcrypt.compareSync(password, hashedPassword); // true if matched
}


exports.generateToken=(customerId,email,role)=>{
return  jwt.sign({
    customerId:customerId,
    email:email,
    role:role
  }, process.env.JWT_SECTET_KEY, { expiresIn: '1h' });
}

exports.verifytoken=(token)=>{
  // console.log(token,"jjjjj");
 return jwt.verify(token,process.env.JWT_SECTET_KEY, function(err, decodedData) {
    if (err) {
      console.log("jwt error");
      /*
      
        err = {
          name: 'TokenExpiredError',
          message: 'jwt expired',
          expiredAt: 1408621000
        }
      */
    return false;
    }else{
      console.log(decodedData);
      return decodedData;
    }
  });
}