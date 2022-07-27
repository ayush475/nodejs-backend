const db = require("../../config/database");

const { checkIfTableExist } = require("./commonCreation");

exports.createCustomerTableIfNotExist = async () => {
  const isTableExist = await checkIfTableExist("Customer");
  console.log(isTableExist, "lll");
  // there is no table create table,it's updated table and its triggers
  if (!isTableExist) {
    // query to create supplier table
    var sqlQueryTable = `
        create table Customer(customerId int auto_increment unique not null primary key ,
        email varchar(50) unique not null,
        password varchar(255) not null,
        name varchar(50) not null,
        customerType varchar(20) not null,
        state varchar(50) not null,
        city varchar(50) not null,
        street varchar(50) not null,
        contactNo varchar(10) not null,
        profileImage json,
        role varchar(10) default "user",
        shippingAddress varchar(255) default null,
        openedDate datetime default now(),
        closedDate datetime default null
        );`;

    var sqlQueryUpdateTable = `create table CustomerUpdate(updateId int auto_increment unique not null,
                customerId int not null references Customer(customerId),
                email varchar(50) not null,
                name varchar(50) not null,
                customerType varchar(20) not null,
                state varchar(50) not null,
                city varchar(50) not null,
                street varchar(50) not null,
                contactNo varchar(10) not null,
                role varchar(10) not null,
                shippingAddress varchar(255) default null,
                updatedOn datetime default null,
                action varchar(50) DEFAULT null
                );`;

    var sqlBeforeUpdateTrigger =
      "CREATE TRIGGER beforeCustomerUpdate" +
      " BEFORE UPDATE ON Customer" +
      " FOR EACH ROW" +
      " BEGIN" +
      " INSERT INTO CustomerUpdate" +
      ` SET action = 'update',
               customerId=old.customerId,
               name=old.name,
               email=old.email,
               customerType=old.customerType,
               state=old.state,
               city=old.city,
               street=old.street,
               contactNo=old.contactNo,
               role=old.role,
               shippingAddress=old.shippingAddress,
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
