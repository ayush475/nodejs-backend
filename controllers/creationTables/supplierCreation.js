const db=require('../../config/database');

const { checkIfTableExist } = require('./commonCreation');




exports.createSupplierTableIfNotExist =async () => {
    const isTableExist= await checkIfTableExist('supplier');
    console.log(isTableExist,'lll');
    // there is no table create table,it's updated table and its triggers
    if(!isTableExist){

        // query to create supplier table
        var sqlQueryTable=`create table  Supplier(supplierId int auto_increment unique not null primary key ,
            name varchar(50) unique not null,
            email varchar(50) unique not null,
            country varchar(50) not null,
            state varchar(50) not null,
            city varchar(50) not null,
            street varchar(50) not null,
            pinCode int not null,
            poBox int  not null,
            supplierDetails varchar(255) not null,
            supplierImage json,
            addedDate datetime default now(),
            removedDate datetime default null
            );`


            var sqlQueryUpdateTable=`create table if not exists  SupplierUpdate(updateId int auto_increment unique not null,
                supplierId int not null references Supplier(supplierId),
                name varchar(50)  not null,
                email varchar(50)  not null,
                country varchar(50) not null,
                state varchar(50) not null,
                city varchar(50) not null,
                street varchar(50) not null,
                pinCode int not null,
                poBox int  not null,
                supplierDetails varchar(255) not null,
                updatedOn datetime default null,
                action varchar(50) DEFAULT null
                );`;

                var sqlBeforeUpdateTrigger='CREATE TRIGGER beforeSupplierUpdate'+
                ' BEFORE UPDATE ON Supplier' +
               ' FOR EACH ROW' +
               ' BEGIN' +
               ' INSERT INTO SupplierUpdate'+
               ' SET action ="update",supplierId=old.supplierId,name=old.name,email=old.email,country=old.country,state=old.state,city=old.city,street=old.street,pinCode=old.pinCode,poBox=old.poBox,supplierDetails=old.supplierDetails,updatedOn= NOW();' +
               'END;';

        
            return new Promise(async (resolve, reject) => {
           
                db.query(`${sqlQueryTable} ${sqlQueryUpdateTable} ${sqlBeforeUpdateTrigger}`, function (err, result, fields) {
                   if (err) {
                      reject(err);
                   }
                  resolve(result);
                 });

                
                 
               });

    }else{
        // table exist
        return true;
    }
        
        
       
        };


 





    
