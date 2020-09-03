const express = require("express");
const mysql = require("mysql");
const database = require('./database');
const app = express();
const PORT = 5000;

database.open();
app.get("/data", async (req, res) => {
  const result = await database.select('test', '*');
  console.log(`DB = ${result}`);
  const data = {
    lastname: "Fwany2",
    firstname: "Kim",
  };
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});

// function getDBSchedule() {
//   console.log("getDBSchedule");
//   const connection = mysql.createConnection({
//     host: "10.253.70.45",
//     user: "warms",
//     password: "wificore1%",
//     database: "react_prac",
//   });
  
//   connection.connect();
//   connection.query("SELECT * FROM test", function (error, results, fields) {
//     if (error) throw error;
//     console.log("The solution is: ", results);
//   });
//   connection.end();
// }

