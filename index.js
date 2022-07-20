//connecting node js to  localhost or required hosts
//enter the variables as desirable
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "classicmodels"
});

/*
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "select * from customers;";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("test passes");
  });
});

*/
con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM customers where customernumber>=300", function (err, result, fields) {
    if (err) throw err;
    console.log(JSON.parse(JSON.stringify(result)));//json.parse  used
  });

});


