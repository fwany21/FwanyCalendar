const express = require("express");
const mysql = require("mysql");
const database = require("./database");
const app = express();
const PORT = 5000;

database.open();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/data", async (req, res) => {
  const result = await database.select("test", "*");
  // const data = {
  //   lastname: "Fwany2",
  //   firstname: "Kim",
  // };
  const scheduleData = result.out;

  for (let i = 0; i < scheduleData.length; i += 1) {
    scheduleData[i].id = scheduleData[i].id.toString();
  }
  res.json(scheduleData);
});

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});

app.post("/register", async (req, res) => {
  console.log(req.body.title);
  console.log(req.body.start);
  console.log(req.body.end);
  console.log(req.body.id);
  await database.insert(
    "test",
    `${req.body.title}, ${req.body.start}, ${req.body.end}`
  );
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
