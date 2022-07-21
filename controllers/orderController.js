const db=require('../config/database')

exports.getAllOrders=(req,res,next)=>{
  db.query("SELECT * FROM customers where customernumber>=300", function (err, result, fields) {
    if (err) throw err;
    console.log();//json.parse  used
   return res.status(200).json(result);
  });
}