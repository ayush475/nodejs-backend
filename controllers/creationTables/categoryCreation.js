const db = require("../../config/database");

const { checkIfTableExist } = require("./commonCreation");

exports.createCategoryTableIfNotExist = async () => {
  const isTableExist = await checkIfTableExist("Category");
  console.log(isTableExist, "lll");
  // there is no table create table,it's updated table and its triggers
  if (!isTableExist) {
    // query to create supplier table
    var sqlQueryTable = `create table Category(categoryId int auto_increment unique not null primary key,
            name  varchar(50)  not null unique,
            profit int  not null,
            vat int default null,
            customDuty  int default null,
            addedDate datetime default now(),
            removedDate datetime default null
            );`;

    var sqlQueryUpdateTable = `create table CategoryUpdate(updateId int auto_increment unique not null primary key,
                categoryId int references Catetory(categoryId),
                name  varchar(50) not null,
                profit int not null,
                vat int  not null,
                customDuty  int   not null,
                updatedOn datetime default null,
                action varchar(50) DEFAULT null,
                foreign key(categoryId) references Category(categoryId)
                );`;

    var sqlBeforeUpdateTrigger =
      "CREATE TRIGGER beforeCategoryUpdate" +
      " BEFORE UPDATE ON Category" +
      " FOR EACH ROW" +
      " BEGIN" +
      " INSERT INTO CategoryUpdate" +
      ` SET action = 'update',
               categoryId=old.categoryId,
               name=old.name,
               profit=old.profit,
               vat=old.vat,
               customDuty=old.customDuty,
               updatedOn= NOW();` +
      "END;";

    var sqlGetVAtFromCategory =
      `CREATE FUNCTION getVatFromCategory ( nam varchar(40) )` +
      ` RETURNS float deterministic` +
      ` BEGIN` +
      ` DECLARE vatamt float;` +
      ` select vat into vatamt from Category  where name=nam;` +
      ` RETURN vatamt;` +
      `END;`;

    var sqlGetCustomDutyFromCategory =
      `CREATE FUNCTION getCustomDutyFromCategory ( nam varchar(40) )` +
      ` RETURNS float deterministic` +
      ` BEGIN` +
      ` DECLARE customdutyamt float;` +
      ` select customDuty into customdutyamt from Category  where name=nam;` +
      ` RETURN customdutyamt;` +
      `END;`;

      // var sqlGetVatFromCategory =
      // `CREATE FUNCTION getProfitFromCategory ( nam varchar(40) )` +
      // ` RETURNS float deterministic` +
      // ` BEGIN` +
      // ` DECLARE profitamt float;` +
      // ` select profit into profityamt from Category  where name=nam;` +
      // ` RETURN profitamt;` +
      // `END;`;


    return new Promise(async (resolve, reject) => {
      db.query(
        `${sqlQueryTable} ${sqlQueryUpdateTable} ${sqlBeforeUpdateTrigger} ${sqlGetCustomDutyFromCategory} ${sqlGetVAtFromCategory}`,
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
