const db = require("../../config/database");

const { checkIfTableExist } = require("./commonCreation");

exports.createMyOrderTableIfNotExist = async () => {
  const isTableExist = await checkIfTableExist("MyOrder");
  console.log(isTableExist, "lll");
  // there is no table create table,it's updated table and its triggers
  if (!isTableExist) {
    // query to create supplier table
    var sqlQueryTable = `create table MyOrder(myOrderId int auto_increment unique not null primary key ,
            productId int not null,
            quantity int not null,
            eachPrice int not null,
            customDuty int not null,
            myOrderStatus varchar(20) default "processing",
            paymentStatus varchar(20) default "unpaid",
            paymentMode varchar (20) default "COD",
            orderedDate datetime default now(),
            cancelledDate datetime default null,
            expectedDeliveryDate datetime default null,
            deliveredDate datetime default null,
            foreign key(productId) references Product(productId)
            );`;

    var sqlQueryUpdateTable = `create table MyOrderUpdate(updateId int auto_increment unique not null,
                myOrderId int not null ,
                quantity int not null,
                myOrderStatus varchar(20) default null,
                paymentStatus varchar(20) default null,
                paymentMode varchar (20) default null,
                updatedOn datetime default null,
                action varchar(50) DEFAULT null,
                foreign key(myOrderId) references MyOrder(myOrderId)
                );`;

    var sqlBeforeUpdateTrigger =
      "CREATE TRIGGER beforeMyOrderUpdate" +
      " BEFORE UPDATE ON MyOrder" +
      " FOR EACH ROW" +
      " BEGIN" +
      " INSERT INTO MyOrderUpdate" +
      ` SET action = 'update',
               myOrderId = OLD.myOrderId,
               quantity = OLD.quantity,
               myOrderStatus=old.myOrderStatus,
               paymentStatus=old.paymentStatus,
               paymentMode=old.paymentMode,
               updatedOn= NOW();` +
      "END;";

    var sqlUpdateProductStatusAndStockOnDelivery =
      `CREATE PROCEDURE updateProductStockOnDelivery(IN importOrderId int)` +
      ` BEGIN` +
      ` DECLARE pid INT;` +
      ` DECLARE qty INT;` +
      ` SET SQL_SAFE_UPDATES = 0;` +
      ` SELECT productId INTO pid from MyOrder
        WHERE MyOrder.myOrderId= importOrderId;` +
      ` SELECT quantity INTO qty from MyOrder
        WHERE MyOrder.myOrderId= importOrderId;` +
      ` update product
        set stock=qty,
        productStatus="unpublished"
        where  productId=pid;` +
      ` update MyOrder
        set myOrderStatus="delivered",
        paymentStatus="paid",
        deliveredDate=now()
        where myorderId=importOrderId;`+
        `END;`;

    return new Promise(async (resolve, reject) => {
      db.query(
        `${sqlQueryTable} ${sqlQueryUpdateTable} ${sqlBeforeUpdateTrigger} ${sqlUpdateProductStatusAndStockOnDelivery}`,
        function (err, result, fields) {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
  } else {
    // table exist
    return true;
  }
};
