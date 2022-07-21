const bcrypt = require('bcryptjs');

const jwt =require('jsonwebtoken');
const { token } = require('morgan');


exports.getHashedPassword=async(password)=>{
  var salt = await bcrypt.genSaltSync(10);
 var hash =await bcrypt.hashSync(password, salt);
 return hash;
    
}

exports.comparePassword=async(password,hashedPassword)=>{
  console.log(password,hashedPassword);
 return  await bcrypt.compareSync(password, hashedPassword); // true if matched
}


exports.generateToken=(customerId,email)=>{
return  jwt.sign({
    customerId:customerId,
    email:email
  }, process.env.JWT_SECTET_KEY, { expiresIn: '1h' });
}

exports.verifytoken=(token)=>{
 return jwt.verify(token, 'shhhhh', function(err, decodedData) {
    if (err) {
      /*
        err = {
          name: 'TokenExpiredError',
          message: 'jwt expired',
          expiredAt: 1408621000
        }
      */
    }
    console.log(decodedData);
    return decodedData;
  });
}