const app = require("./app");
const dotenv = require("dotenv");
const db = require("./config/database");
const cloudinary = require("cloudinary");


dotenv.config({ path: "./config/.env" });
port = process.env.PORT || 8000;

//connecting to cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



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