var express = require("express");
var app = express();

var path = require("path");
var session = require("express-session");
var moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
var Web3 = require("web3");
var product_contract = require("./build/contracts/bus_safe.json");
const apiRouter = require('./routes/router')
var mysql = require("mysql2");


var connection = mysql.createConnection({
  //host: "192.168.0.5",
  host: "localhost",
  port: 3306, // db 포트
  user: "root", // user 이름
  password: "1234", // 비밀번호
  database: "bussafe", // database 이름
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "eewrwerwe",
    resave: false,
    saveUninitialized: true,
  })
);

app.use('/', apiRouter)


var port = 8080;
app.listen(port, function () {
  var check_time = moment().format("YYYYMMDDHHmmss");
  console.log(check_time);
  console.log("웹 서버 시작", port);
});
