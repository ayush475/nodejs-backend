const app = require("./app");
const dotenv = require("dotenv");
const db = require("./config/database");


dotenv.config({ path: "./config/.env" });
port = process.env.PORT || 8000;

//connecting to database



//handling uncaught exception (console.log(you);)
process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

const server = app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

// handling unhandeled promise rejection/mongodb parse error
process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("shutting down the server due to unhandled rejection");
  server.close(() => {
    process.exit(1);
  });
});