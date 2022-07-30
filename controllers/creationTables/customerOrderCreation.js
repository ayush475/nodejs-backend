const db = require("../../config/database");

const { checkIfTableExist } = require("./commonCreation");

exports.createCustomerOrderTableIfNotExist = async () => {
  const isTableExist = await checkIfTableExist("CustomerOrder");
  console.log(isTableExist, "lll");
  // there is no table create table,it's updated table and its triggers
  if (!isTableExist) {
    // query to create supplier table
    var sqlQueryTable = `create table customerOrder (orderId int auto_increment unique not null primary key ,
            productId int not null,
            customerId int not null,
            eachPrice int not null,
            quantity int not null,
            vat int not null,
            orderStatus varchar(20) default "processing",
            paymentStatus varchar(20) default "unpaid",
            paymentMode varchar (20) default "COD",
            orderedDate datetime default now(),
            cancelledDate datetime default null,
            expectedDeliveryDate datetime default null,
            deliveredDate datetime default null,
            foreign key(productId) references Product(productId),
            foreign key(customerId) references Customer(customerId)
            );`;

    var sqlQueryUpdateTable = `create table customerOrderUpdate(updateId int auto_increment unique not null,
                orderId int not null,
                quantity int not null,
                orderStatus varchar(20) default null,
                paymentStatus varchar(20) default null,
                paymentMode varchar (20) default null,
                updatedOn datetime default null,
                action varchar(50) DEFAULT null,
                foreign key(orderId) references CustomerOrder(orderId)
                );`;

    var sqlBeforeUpdateTrigger =
      "CREATE TRIGGER beforeCustomerOrderUpdate" +
      " BEFORE UPDATE ON CustomerOrder" +
      " FOR EACH ROW" +
      " BEGIN" +
      " INSERT INTO CustomerOrderUpdate" +
      ` SET action = 'update',
               orderId = OLD.orderId,
               quantity = OLD.quantity,
               orderStatus=old.orderStatus,
               paymentStatus=old.paymentStatus,
               paymentMode=old.paymentMode,
               updatedOn= NOW();` +
      "END;";

     

    return new Promise(async (resolve, reject) => {
      db.query(
        `${sqlQueryTable} ${sqlQueryUpdateTable} ${sqlBeforeUpdateTrigger}`,
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
