const db=require('../../config/database');

const { checkIfTableExist } = require('./commonCreation');




exports.createProductTableIfNotExist =async () => {
    const isTableExist= await checkIfTableExist('product');
    console.log(isTableExist,'lll');
    // there is no table create table,it's updated table and its triggers
    if(!isTableExist){

        // query to create supplier table
        var sqlQueryTable=`
        create table Product(productId int auto_increment unique not null primary key ,
        name varchar(50) unique not null,
        category varchar(50) not null,
        brand varchar(20) not null,
        productDescription varchar(255)  not null,
        price int not null,
        customDuty int not null,
        vat int not null,
        supplierId  int  references Supplier(supplierId),
        productImage json,
        productStatus varchar(20) default null,
        createdDate datetime default now(),
        deletedDate datetime default null
        );`;


            var sqlQueryUpdateTable=`create table ProductUpdate(updateId int auto_increment unique not null,
                productId int not null references Product(productId),
                name varchar(50)  not null,
                category varchar(50) not null,
                brand varchar(20) not null,
                productDescription varchar(255)  not null,
                price int not null,
                customDuty int not null,
                vat int not null,
                productStatus varchar(20) default null,
                updatedOn datetime default null,
                action varchar(50) DEFAULT null
                );`;

                var sqlBeforeUpdateTrigger='CREATE TRIGGER beforeProductUpdate'+
                ' BEFORE UPDATE ON Product' +
               ' FOR EACH ROW' +
               ' BEGIN' +
               ' INSERT INTO ProductUpdate'+
               ` SET action = 'update',
               productId=old.productId,
               name=old.name,
               category=old.category,
               brand=old.brand,
               productDescription=old.productDescription,
               price=old.price,
               customDuty=old.customDuty,
               vat=old.vat,
               productStatus=old.productStatus,
               updatedOn= NOW();` +
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


 





    
