const db=require('../../config/database');




exports.checkIfTableExist = (tableName) => {
    var sqlQuery=`show tables like '${tableName}';`;
    console.log(sqlQuery);
    
    
    return new Promise(async (resolve, reject) => {
       
         db.query(sqlQuery, function (err, result, fields) {
            if (err) {
               reject(err);
            }
            console.log(result);
            if(result.length>0){
                resolve(true);
            }else{
                resolve(false);
            }
          
          });
          
        });
    };