require("dotenv").config();
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT,
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting:", err);
  } else {
    console.log("Database Connected");
  }
});

module.exports = connection;