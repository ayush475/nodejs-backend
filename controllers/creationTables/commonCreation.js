const db = require("../../config/database");

exports.convertToMySqlDateTime = async (date) => {
  return await date.toISOString().slice(0, 19).replace("T", " ");
};

exports.checkIfTableExist = (tableName) => {
  var sqlQuery = `show tables like '${tableName}';`;
  console.log(sqlQuery);

  return new Promise(async (resolve, reject) => {
    db.query(sqlQuery, function (err, result, fields) {
      if (err) {
        reject(err);
      }
      console.log(result);
      if (result.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

exports.getVatFromProduct = (productId) => {
  var sqlQuery =`select getVat(${productId})`;
  console.log(sqlQuery);

  return new Promise(async (resolve, reject) => {
    db.query(sqlQuery, function (err, result, fields) {
      if (err) {
        reject(err);
      }
      
      if (result.length > 0) {
        console.log(result[0]);
        const data=result[0];
      
         var [firstKey]=Object.keys(result[0]);
        // console.log(data[firstKey]);
        resolve(data[firstKey]);
      } else {
        resolve(false);
      }
    });
  });
};


exports.getCustomDutyFromProduct = (productId) => {
    var sqlQuery =`select getCustomDuty(${productId})`;
    console.log(sqlQuery);
  
    return new Promise(async (resolve, reject) => {
      db.query(sqlQuery, function (err, result, fields) {
        if (err) {
          reject(err);
        }
        
        if (result.length > 0) {
          console.log(result[0]);
          const data=result[0];
        
           var [firstKey]=Object.keys(result[0]);
          // console.log(data[firstKey]);
          resolve(data[firstKey]);
        } else {
          resolve(false);
        }
      });
    });
  };


  exports.getEachPriceFromProduct = (productId) => {
    var sqlQuery =`select getEachPrice(${productId})`;
    console.log(sqlQuery);
  
    return new Promise(async (resolve, reject) => {
      db.query(sqlQuery, function (err, result, fields) {
        if (err) {
          reject(err);
        }
        
        if (result.length > 0) {
          console.log(result[0]);
          const data=result[0];
        
           var [firstKey]=Object.keys(result[0]);
          // console.log(data[firstKey]);
          resolve(data[firstKey]);
        } else {
          resolve(false);
        }
      });
    });
  };




  exports.getVatFromCategory = (categoryName) => {
    var sqlQuery =`select getVatFromCategory('${categoryName}');`;
    console.log(sqlQuery);
  
    return new Promise(async (resolve, reject) => {
      db.query(sqlQuery, function (err, result, fields) {
        if (err) {
          reject(err);
        }
        
        console.log(result,"mmm");
        if (result.length > 0) {
          console.log(result[0]);
          const data=result[0];
        
           var [firstKey]=Object.keys(result[0]);
          // console.log(data[firstKey]);
          resolve(data[firstKey]);
        } else {
          resolve(false);
        }
      });
    });
  };
  
  
  exports.getCustomDutyFromCategory = (categoryName) => {
      var sqlQuery =`select getCustomDutyFromCategory('${categoryName}');`;
      console.log(sqlQuery);
    
      return new Promise(async (resolve, reject) => {
        db.query(sqlQuery, function (err, result, fields) {
          if (err) {
            reject(err);
          }
          console.log(result,"mmmmmm");
          
          if (result.length > 0) {
            console.log(result[0]);
            const data=result[0];
          
             var [firstKey]=Object.keys(result[0]);
            // console.log(data[firstKey]);
            resolve(data[firstKey]);
          } else {
            resolve(false);
          }
        });
      });
    };
  
