
  var mysql = require("mysql2");
 



  const pool_config={
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  }
 
 console.log(pool_config);

  const pool = mysql.createPool(pool_config);


  pool.getConnection(function (err, connection) {
  
    console.log(`connected to database as ${process.env.USER}`);
    // connected! (unless `err` is set)
    

  });

  pool.on("error", function (err) {
    console.log(err.code); // 'ER_BAD_DB_ERROR'
    // https://www.npmjs.com/package/mysql#error-handling
  });

 


module.exports = pool;
