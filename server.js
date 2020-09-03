err_insufficient_resourcesconst express = require("express");
const mysql = require("mysql");
const app = express();
const PORT = 5000;

app.get("/data", (req, res) => {
  const data = {
    lastname: "Fwany2",
    firstname: "Kim",
  };
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});

var connection = mysql.createConnection({
  host: "10.253.70.45",
  user: "warms",
  password: "wificore1%",
  database: "react_prac",
});

connection.connect();
connection.query("SELECT * FROM test", function (error, results, fields) {
  if (error) throw error;
  console.log("The solution is: ", results);
});
connection.end();
