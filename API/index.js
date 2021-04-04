var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");

var mysql = require("mysql");

app.use(bodyParser.json());
app.use(cors());

// connection configurations
var dbConn = mysql.createConnection({
  host: "your host ",
  user: "username",
  password: "password",
  database: "database",
  port: 3306,
  ssl:true,

});
// connect to database
dbConn.connect();

// default route
//www.domain.com
app.get("/", function (req, res) {
  return res.send({ error: true, message: "Inevntonodeapi Activated" });
});

// Retrieve all users
app.get("/information", function (req, res) {
  dbConn.query("SELECT * FROM users", function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: "Complete Data." });
  });
});
// Retrieve user with id
app.get("/mydata/:id", function (req, res) {
  let id = req.params.id;

  if (!id) {
    return res.status(400).send({ error: true, message: "Please provide id" });
  }

  dbConn.query(
    "SELECT * FROM users where id=?",
    id,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results[0],
        message: "Information by ID.",
      });
    }
  );
});

// Add a new Record
app.post("/adduser", function (req, res) {
    console.log(req.body);
  let name = req.body.name;
  let aadhar_no = req.body.aadhar_no;
  let phone = req.body.phone;
  let dob = req.body.dob;
  console.log(name + " " + aadhar_no + " " + phone + " " + dob);
  if (!name && !aadhar_no && !phone && !dob) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide Information to be add" });
  }

  dbConn.query(
    "INSERT INTO users(name, aadhar_no, phone, dob) value(?,?,?, ?) ",
    [name, aadhar_no, phone, dob],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "Record has been added",
      });
    }
  );
});

//  Update user with id
app.put("/update", function (req, res) {
  let id = req.body.id;
  let name = req.body.name;
  let aadhar_no = req.body.aadhar_no;
  let phone = req.body.phone;
  let dob = req.body.dob;
  if (!id || !name || !aadhar_no || !phone || !dob) {
    return res
      .status(400)
      .send({
        error: user,
        message: "Please provide full information with id",
      });
  }

  dbConn.query(
    "UPDATE users SET name = ?, aadhar_no= ?, phone= ?, dob= ? WHERE id = ?",
    [name, aadhar_no, phone, dob, id],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, data: results, message: "data updated" });
    }
  );
});

//  Delete user
app.delete("/deleteuser", function (req, res) {
  let id = req.body.id;

  if (!id) {
    return res.status(400).send({ error: true, message: "Please provide id" });
  }
  dbConn.query(
    "DELETE FROM users WHERE id = ?",
    [id],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "User Data has been deleted",
      });
    }
  );
});
// set port
app.listen(8080, function () {
  console.log("Node app is running on port 8080");
});
module.exports = app;

// fetch("https://inventonodeapi.azurewebsites.net/adduser", {
//   method: "POST",
//   headers: { "Content-Type": "applocation/json" },
//   body: JSON.stringify({ "name":"deva","aadhar_no":"1235689","phone":"91773","dob":"08012000"}),
// }).then((res = res.json()));
