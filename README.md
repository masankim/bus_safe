이더리움 기반의 솔리디티 언어를 이용한 스마트 컨트렉트 사설넷 인스톨 한 후 

nodejs와 mysql 과의 연동을 하는 프로젝트를 구현



### 1. smart contract 구현 및 배포

Truffle framework를 활용해서 프로젝트 생성

truffle 설치 - 글로벌 영역에 설치

```
npm install -g truffle 
```



```powershell
mkdir bus_safe && cd bus_safe
truffle init
```



![image-20201208171332376](https://user-images.githubusercontent.com/75194770/101488922-922ff100-39a3-11eb-884a-7cc2b6faf7b1.png)


위와 같은 구조의 프레임워크 생성

contracts/bus_safe.sol 생성후 계약 작성

```sol
pragma solidity >=0.4.22 <0.8.0;

contract bus_safe {
    uint32 check_count;

    event AddCheck(
        address checker,
        string car_id,
        string check_res,
        string check_etc,
        uint64 check_time
    );

    struct check_list {
        address checker;
        string car_id;
        string check_res;
        string check_etc;
        uint64 check_time;
    }

    check_list[] public checks;

    function AddCheckList(string memory _car_id, string memory _check_res, string memory _check_etc,uint64 _check_time  ) public {
        address _checker = msg.sender;
        checks.push(check_list(_checker , _car_id,_check_res,_check_etc,_check_time));
        check_count ++;
        emit AddCheck(_checker , _car_id,_check_res,_check_etc,_check_time);
    }
    function TotalCount() public view returns(uint32) {
            return check_count;
        }

        
    function GetCheck(uint _index) public view returns(address ,string memory,string memory,string memory,uint64){
        return (checks[_index].checker, checks[_index].car_id,checks[_index].check_res, checks[_index].check_etc, checks[_index].check_time );
    }

    // function GetCheck(uint _index) public view returns(address){
    //     return checks[_index].checker;
    // }
        
}
```



migrations/1_deploy_contracts.js

```javascript
const bus_safe = artifacts.require("bus_safe");

module.exports = function (deployer) {
  deployer.deploy(bus_safe);
};
```



#### 사설넷에 스마트 컨트렉트를 디플로이 한다.

솔리디티 언어를 컴파일 한후 컴파일한 파일을 migrate 한다.



```powershell
truffle develop 

```

![image-20201208172742898](https://user-images.githubusercontent.com/75194770/101488915-90662d80-39a3-11eb-8301-a3c95f408d4d.png)



```
truffle(develop)> complie
truffle(develop)> migrate --reset
```

![image-20201208173116923](https://user-images.githubusercontent.com/75194770/101489009-af64bf80-39a3-11eb-95bf-7219062e4db9.png)

compile을 진행하면 build 폴더에 cotracts/json 파일이 생성된다.

abi 와 address의 정보가 들어있다.



##### nodejs를 이용해서 웹서버 구현하기 위해  bus_safe폴더에 package.json파을을 생성하고 기본정보 입력하는 npm init을이용해서 구성한다.

```powershell
npm init -y 
```


![image-20201208173947565](https://user-images.githubusercontent.com/75194770/101489049-c0adcc00-39a3-11eb-9ade-30945188b12c.png)

위와 같은 프로젝트 구조를 가진 Dapps를 구현한다.

views 폴더 : view 탬플릿 저장된다.(html, ejs)

public 폴더 :  js, css, image (static(정적) 파일을 저장)

routes : router.js



index.js파일을 생성후 다음과 같이 코딩

```javascript
var express = require("express");
var app = express();
var path = require("path");
var session = require("express-session");
var moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");


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



var port = 8080;
app.listen(port, function () {
  var check_time = moment().format("YYYYMMDDHHmmss");
  console.log(check_time);
  console.log("웹 서버 시작", port);
});

```



회원가입과 로그인 기능을 구현하기 위해 다음과 같이 코딩



routes/router.js

```javascript
const express = require('express')
const router = express.Router()
var mysql = require("mysql2");

//localhost:8080/signup get방식으로 요청이 들어오면 signup.ejs파일 errormessage로 데이터와 함께 HTML DOCUMENT를 변환한 데이터를 클라이언트에게 전송
app.get("/signup", function (req, res) {
  res.render("signup", { errormessage: null });
});

module.exports= router;

```

views/signup.ejs를 구현한다.

```html
<!DOCTYPE html>
<!--
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
  <head>
    <title>Bus Safety System Sign Up</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=no"
    />
    <link rel="stylesheet" href="/assets/css/main.css" />
  </head>
  <body class="is-preload">
    <!-- Wrapper -->
    <div id="wrapper">
      <!-- Main -->
      <div id="main">
        <div class="inner">
          <!-- Header -->
          <header id="header">
            <a href="/" class="logo"
              >Bus <strong>Safety</strong> System</a
            >
            <ul class="icons">
              <li>
                <a href="#" class="icon brands fa-twitter"
                  ><span class="label">Twitter</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-facebook-f"
                  ><span class="label">Facebook</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-snapchat-ghost"
                  ><span class="label">Snapchat</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-instagram"
                  ><span class="label">Instagram</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-medium-m"
                  ><span class="label">Medium</span></a
                >
              </li>
            </ul>
          </header>

          <!-- Banner -->
          <section id="banner">
            <div class="content">
              <p id="join">
                <form method="POST" action="/signup">
                <h1 id="signUpHead">회원가입</h1>
                  <div class="col-6 col-12-xsmall">
                  
                    <input type="text" name="id" id="signUpText" value="" placeholder="사원번호" />
                  </div>
                  <br><br>
                  <div class="col-6 col-12-xsmall">
                    <input type="text" name="name" id="signUpText" value="" placeholder="이름" />
                  </div>
                  <br><br>
                  <div class="col-6 col-12-xsmall">
                    <input type="text" name="division" id="signUpText" value="" placeholder="소속" />
                  </div>
                  <br><br>
                  <div class="col-6 col-12-xsmall">
                    <input type="password" name="password" id="signUpText" value="" placeholder="비밀번호" />
                  </div>
                  <br><br>
                  <div class="col-6 col-12-xsmall">
                    <input type="password" name="demo-email" id="signUpText" value="" placeholder="비밀번호 재확인" />
                  </div>
                  <br><br>
                  <ul class="actions" id="signUpButton">
                    <li><button type="submit" class="button big" id="signUpButton">회원가입</button></li>
                  </ul>
                </form>
              </p>
            </div>
          </section>

          <!-- Section -->


          <!-- Section -->
      
        </div>
      </div>

      <!-- Sidebar -->
    <!-- Scripts -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/browser.min.js"></script>
    <script src="assets/js/breakpoints.min.js"></script>
    <script src="assets/js/util.js"></script>
    <script src="assets/js/main.js"></script>
  </body>
</html>

```



urtl : http://localhost:8080/signup 

method : POST

data : body {

​	id:"",

 	name: "",

   password: "",

   division : ""

}

이걸 받아서 mysql에서 id 값을 조회해서 데이터가 존재하면 에러메세지를 띄워주고 

없으면 mysql 부분에 INSERT 하는 기능 구현한다.

```javascript
router.post("/signup", function (req, res) {
    // console.log(req.body)
    const id = req.body.id;
    const name = req.body.name;
    const password = req.body.password;
    const division = req.body.division;
    let sql =  `select post_id from user_list where post_id=?`
    connection.query(sql,[id],
        function (err, users) {
        if (err) {
            res.render("signup", {
            errormessage: "오류 발생",
            user: req.session.loggedIn,
            });
        } else if (users.length > 0) {
            res.render("signup", {
            errormessage: "이미 존재하는 이메일",
            user: req.session.loggedIn,
            });
        } else {
            console.log(id);
            console.log(password);
            console.log(name);
            console.log(division);
            let sql = `insert into user_list (post_id, password, name, division, linkcode) values (?, ?, ?, ?, 1)`
            connection.query(sql,[id, password, name, division],
            function (err2, result) {
                if (err2) {
                res.render("signup", {
                    errormessage: "생성 오류",
                    user: req.session.loggedIn,
                });
                } else {
                console.log("생성완료");
                res.send("/login");
                }
            }
            );
        }
        }
    );
});
```



회원가입이 성공하면  redirect을 한다. 

http://localhost:8080/login 

method : GET

이렇게 요청을 들어오므로 

routes/router.js에 다음같은 코드를 추가한다.



```javascript
router.get("/login", function (req, res) {
    res.render("login", { error: false, user: req.session.loggedIn });
  });
```





views/login.ejs파일을 만들고 다음과 코드를 구현한다.

```html
<!DOCTYPE html>
<!--
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
  <head>
    <title>Bus Safety System Main</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=no"
    />
    <link rel="stylesheet" href="/assets/css/main.css" />
    <script>
      function menuload() {
        let time = new Date();
      }
      function logout() {
        location.href = "logout";
      }
    </script>
  </head>
  <body class="is-preload" onload="menuload()">
    <!-- Wrapper -->
    <div id="wrapper">
      <!-- Main -->
      <div id="main">
        <div class="inner">
          <!-- Header -->
          <header id="header">
            <a href="index.html" class="logo"
              >Bus <strong>Safety</strong> System</a
            >
            <ul class="icons">
              <li>
                <a href="#" class="icon brands fa-twitter"
                  ><span class="label">Twitter</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-facebook-f"
                  ><span class="label">Facebook</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-snapchat-ghost"
                  ><span class="label">Snapchat</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-instagram"
                  ><span class="label">Instagram</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-medium-m"
                  ><span class="label">Medium</span></a
                >
              </li>
            </ul>
          </header>

          <!-- Banner -->
          <section id="banner">
            <div class="content">
              <header>
                <h1>
                  Bus<br />
                  Safety<br />
                  System
                </h1>
                <p>It's checking system for your safety</p>
              </header>
              <p>
                Bus Safety System은 블록체인을 이용하여 버스 안전점검 내용을
                저장합니다. 관리자는 더욱 쉽게 관리내역을 정리할 수 있으며
                엔지니어 또한 간단한 방법으로 점검내용을 저장할 수 있습니다.
                블록체인 기술로 안전하게 데이터를 저장할 수 있으며 투명한
                내역으로 버스를 이용하는 승객이라면 누구나 열람할 수 있습니다.
              </p>
              <ul class="actions">
                <li><a class="button big" href="/signup">sign up</a></li>
              </ul>
            </div>
            <span class="image object">
              <img src="images/main_bus.jpg" alt="" />
            </span>
          </section>
        </div>
      </div>

      <!-- Sidebar -->
      <div id="sidebar">
        <div class="inner">
          <!-- Search -->
          <section id="search" class="alt">
            <form method="post" action="#">
              <input type="text" name="query" id="query" placeholder="Search" />
            </form>
          </section>

          <!-- Menu -->
          <nav id="menu">
            <header class="major">
              <h2>User</h2>
            </header>
            로그인 후 이용해 주세요.<br /><br />
            <form method="POST" action="login">
              <div>
                <div class="col-6 col-12-xsmall">
                  <input
                    type="text"
                    name="id"
                    id="demo-email"
                    value=""
                    placeholder="사원번호"
                    required
                  />
                </div>
                <br />
                <div class="col-6 col-12-xsmall">
                  <input
                    type="password"
                    name="password"
                    id="demo-email"
                    value=""
                    placeholder="비밀번호"
                    required
                  />
                </div>
                <br />
                <br />
                <button type="submit" id="logInButton">log in</button>
              </div>
            </form>
          </nav>
          <!-- Section -->

          <!-- Section -->

          <!-- Footer -->
          <footer id="footer">
            <section>
              <ul class="contact">
                <li class="icon solid fa-envelope">
                  bus_ta@gmail.com
                </li>
                <li class="icon solid fa-phone">(02) 123-4567</li>
                <li class="icon solid fa-home">
                  서울특별시 서초구 서초중앙로63,
                  <br />리더스빌딩 5층 <br />(06651)
                </li>
              </ul>
            </section>
            <p class="copyright">
              &copy; International KBCI 2020
            </p>
          </footer>
        </div>
      </div>
    </div>

    <!-- Scripts -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/browser.min.js"></script>
    <script src="assets/js/breakpoints.min.js"></script>
    <script src="assets/js/util.js"></script>
    <script src="assets/js/main.js"></script>
  </body>
</html>

```



login기능을 구현하기 위해서 

url : http://localhost:8080/login

method : POST 

body   {

​	id:" " ,

   password:" ''

}

routes/router.js 다음과 같은 코드를 추가한다.



```javascript
router.post("/login", function (req, res) {
    const id = req.body.id;
    const password = req.body.password;
    let sql = "select * from user_list WHERE post_id=? and password=?"
    connection.query(sql,[id, password],
      function (err, users) {
        if (err) {
          console.log(err); // 오류
          res.send("error");
        } else if (users.length > 0) {
          req.session.loggedIn = users[0];
          if (users[0].linkcode == 0) {
            connection.query(
              "SELECT * FROM user_list where post_id = ?",
              [req.session.loggedIn.post_id],
              function (err, result, fields) {
                if (err) {
                  console.log(err);
                } else {
                  res.render("m_select_menu", {
                    userlist: result,
                    user: req.session.loggedIn,
                  });
                }
              }
            );
          } else {
            res.redirect("/car_list");
          }
        } else {
          //users "빈 list"
          res.render("login", { error: true, user: req.session.loggedIn });
        }
      }
    );
});
```





login 성공시  linkcode ! = 0 때는   res.redirect("/car_list") 이므로

url : http://localhost:8080/car_list

method : GET

을 구현한다.

routes/router.js 다음과 같은 코드를 추가한다.

```javascript
app.get("/car_list", function (req, res) {
  if (!req.session.loggedIn) {
    res.redirect("/logout");
  } else {
    var sql = "SELECT * FROM car_list";
    connection.query(sql, function (err, rows, fields) {
      if (err) {
        console.log("query is not excuted. select fail...\n" + err);
      } else {
        connection.query(
          "SELECT name, division FROM user_list where post_id = ?",
          [req.session.loggedIn.post_id],
          function (err, result, fields) {
            if (err) {
              console.log(err);
            } else {
              res.render("car_list", {
                carlist: rows,
                userlist: result,
                user: req.session.loggedIn,
              });
            }
          }
        );
      }
    });
  }
});
```





views/car_list.ejs 을 추가하고 다음과 같이 코드를 구현한다.

```html
<!DOCTYPE html>
<!--
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
  <head>
    <title>Bus Safety System Car list</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=no"
    />
    <link rel="stylesheet" href="/assets/css/main.css" />
    <script>
      function check_list(num) {
        location.href = "/check_list/" + num;
      }
    </script>
  </head>
  <body class="is-preload" onload="menuload();">
    <!-- Wrapper -->
    <div id="wrapper">
      <!-- Main -->
      <div id="main">
        <div class="inner">
          <!-- Header -->
          <header id="header">
            <a class="logo" href="/home">Bus <strong>Safety</strong> System</a>
            <ul class="icons">
              <li>
                <a href="#" class="icon brands fa-twitter"
                  ><span class="label">Twitter</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-facebook-f"
                  ><span class="label">Facebook</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-snapchat-ghost"
                  ><span class="label">Snapchat</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-instagram"
                  ><span class="label">Instagram</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-medium-m"
                  ><span class="label">Medium</span></a
                >
              </li>
            </ul>
          </header>

          <!-- Content -->
          <section>
            <header class="main">
              <h1 id="car_list_header">차량 목록</h1>
            </header>
            <div>
              <table>
                <thead>
                  <tr>
                    <th class="list_TableHead">차량 번호</th>
                    <th class="list_TableHead">소속</th>
                    <th class="list_TableHead">차량 종류</th>
                    <th class="list_TableHead">최종 검사일</th>
                    <th class="list_TableHead">최종 결과</th>
                  </tr>
                </thead>
                <tbody>
                  <!--for문-->
                  <% for(var i=0; i< carlist.length; i++) { %>
                  <tr onclick="check_list('<%=carlist[i].car_id%>')">
                    <td class="list_TableHead"><%=carlist[i].car_id%></td>
                    <td class="list_TableHead"><%=carlist[i].car_div%></td>
                    <td class="list_TableHead"><%=carlist[i].car_type%></td>
                    <td class="list_TableHead"><%=carlist[i].car_day%></td>
                    <td class="list_TableHead"><%=carlist[i].var_result%></td>
                  </tr>
                  <% } %>
                  <!--for문 끝-->
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      <%- include ("./sidebar.ejs") %>
    </div>

    <!-- Scripts -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/browser.min.js"></script>
    <script src="assets/js/breakpoints.min.js"></script>
    <script src="assets/js/util.js"></script>
    <script src="assets/js/main.js"></script>
  </body>
</html>

```





<tr onclick="check_list('<%=carlist[i].car_id%>')"> 부분을 살펴보면 각 행을 클릭하면 

check_list함수가 실행 되는것을 알 수 있다 

check_list 함수는 

```html
<script>
      function check_list(num) {
        location.href = "/check_list/" + num;
      }
    </script>
```



이렇게 구현되어 있고 location.href = "/check_list/" + num; 는 http://localhost:8080/check_list/<%=carlist[i].car_id%> 이런 경로로

GET방식으로 요청이 들어오게 된다.

<%=carlist[i].car_id%> 이부분을 서버에서 params처리해서 구현한다.

routes/router.js

```javascript
app.get("/check_list/:carnum", function (req, res) {
  const carnum = req.params.carnum;
  var car_res;

  connection.query("SELECT * FROM car_list WHERE car_id=?", [carnum], function (
    err,
    result
  ) {
    if (err) {
      console.log("error");
    } else {
      console.log(result);
      car_res = result;
    }
  });
  if (!req.session.loggedIn) {
    res.redirect("/logout");
  } else {
    var sql = "SELECT * FROM car_list";
    connection.query(sql, function (err, rows, fields) {
      if (err) {
        console.log("query is not excuted. select fail...\n" + err);
      } else {
        connection.query(
          "SELECT name, division FROM user_list where post_id = ?",
          [req.session.loggedIn.post_id],
          function (err, result, fields) {
            if (err) {
              console.log(err);
            } else {
              res.render("check_list", {
                carlist: rows,
                userlist: result,
                carinfo: car_res,
                user: req.session.loggedIn,
              });
            }
          }
        );
      }
    });
  }
});
```

와 같이 구현하고 <%=carlist[i].car_id%> 는mysql에서 조회해온 car_id로 바뀌고 그 부분이 :carnum에서 carnum 부분에 해당되므로 

조회가 정상적으로 이루워 지면 check_list.ejs 가 랜더링 된다. 그러므로 views/check_list.ejs구현한다.



```html
<!DOCTYPE html>
<!--
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
  <head>
    <title>Bus Safety System Check list</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=아니오"
    />
    <link rel="stylesheet" href="/assets/css/main.css" />
    <script>
      function car_list() {
        location.href = "/car_list/";
      }
      function main() {
        location.href = "/main";
      }
    </script>
  </head>
  <body class="is-preload" onload="menuload();">
    <!-- Wrapper -->
    <div id="wrapper">
      <!-- Main -->
      <div id="main">
        <div class="inner">
          <!-- Header -->
          <header id="header">
            <a class="logo" href="/home">Bus <strong>Safety</strong> System</a>
            <ul class="icons">
              <li>
                <a href="#" class="icon brands fa-twitter"
                  ><span class="label">Twitter</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-facebook-f"
                  ><span class="label">Facebook</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-snapchat-ghost"
                  ><span class="label">Snapchat</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-instagram"
                  ><span class="label">Instagram</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-medium-m"
                  ><span class="label">Medium</span></a
                >
              </li>
            </ul>
          </header>

          <!-- Content -->
          <section>
            <form method="post" action="/confirm">
              <header class="main">
                <h1 id="check_list_header">체크리스트</h1>
              </header>
              <div id="check_list_division">
                <span id="check_list_division1"
                  >차량 번호:
                  <input
                    name="car_id"
                    value="<%=carinfo[0].car_id%>"
                    readonly />
                  <strong></strong></span
                ><span id="check_list_division2"
                  >차량 소속:
                  <input
                    name="car_div"
                    value="<%=carinfo[0].car_div%>"
                    readonly />
                  <strong></strong
                ></span>
              </div>
              <br />
              <div>
                <table class="alt">
                  <tr>
                    <td id="check_list_TableHead1">check1</td>
                    <td id="check_list_TableHead2">
                      승객이 이용하는 시설은 깨끗합니까?
                    </td>
                    <td id="check_list_TableHead3">
                      <input
                        type="radio"
                        id="check1"
                        name="check1"
                        value="t"
                        checked
                      />
                      <label for="check1" id="check_list_label">예</label>
                      <input type="radio" id="check2" name="check1" value="f" />
                      <label for="check2" id="check_list_label">아니오</label>
                    </td>
                  </tr>
                  <tr>
                    <td id="check_list_TableHead1">check2</td>
                    <td id="check_list_TableHead2">
                      승객이 이용하는 좌석의 안전벨트는 이상 없습니까?
                    </td>
                    <td id="check_list_TableHead3">
                      <input
                        type="radio"
                        id="check3"
                        name="check2"
                        value="t"
                        checked
                      />
                      <label for="check3" id="check_list_label">예</label>
                      <input type="radio" id="check4" name="check2" value="f" />
                      <label for="check4" id="check_list_label">아니오</label>
                    </td>
                  </tr>
                  <tr>
                    <td id="check_list_TableHead1">check3</td>
                    <td id="check_list_TableHead2">
                      타이어의 공기압은 32 ~ 34 사이 입니까?
                    </td>
                    <td id="check_list_TableHead3">
                      <input
                        type="radio"
                        id="check5"
                        name="check3"
                        value="t"
                        checked
                      />
                      <label for="check5" id="check_list_label">예</label>
                      <input type="radio" id="check6" name="check3" value="f" />
                      <label for="check6" id="check_list_label">아니오</label>
                    </td>
                  </tr>
                  <tr>
                    <td id="check_list_TableHead1">check4</td>
                    <td id="check_list_TableHead2">
                      소화기는 구비되어 있습니까?
                    </td>
                    <td id="check_list_TableHead3">
                      <input
                        type="radio"
                        id="check7"
                        name="check4"
                        value="t"
                        checked
                      />
                      <label for="check7" id="check_list_label">예</label>
                      <input type="radio" id="check8" name="check4" value="f" />
                      <label for="check8" id="check_list_label">아니오</label>
                    </td>
                  </tr>
                  <tr>
                    <td id="check_list_TableHead1">check5</td>
                    <td id="check_list_TableHead2">
                      기름은 80%이상 저장되어 있습니까?
                    </td>
                    <td id="check_list_TableHead3">
                      <input
                        type="radio"
                        id="check9"
                        name="check5"
                        value="t"
                        checked
                      />
                      <label for="check9" id="check_list_label">예</label>
                      <input
                        type="radio"
                        id="check10"
                        name="check5"
                        value="f"
                      />
                      <label for="check10" id="check_list_label">아니오</label>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="col-12">
                <textarea
                  name="checketc"
                  id="check_list_massage"
                  placeholder="기타 사항"
                  rows="10"
                ></textarea>
              </div>
              <br />
              <br />
              <div id="check_list_button">
                <ul class="actions">
                  <li>
                    <a
                      class="button primary"
                      id="check_list_button_ft"
                      onclick="car_list()"
                      >목록</a
                    >
                  </li>
                  <li>
                    <button
                      type="submit"
                      class="button"
                      id="check_list_button_ft"
                    >
                      확인
                    </button>
                  </li>
                </ul>
              </div>
            </form>
          </section>
        </div>
      </div>

      <%- include ("./sidebar.ejs") %>
    </div>

    <!-- Scripts -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/browser.min.js"></script>
    <script src="assets/js/breakpoints.min.js"></script>
    <script src="assets/js/util.js"></script>
    <script src="assets/js/main.js"></script>
  </body>
</html>

```



와 같은 파일에서 확인 버튼을 보면 form 으로 해서 method="post" action="/confirm" 이렇게 구현혔다 .

url : http://localhost:8080/confirm

method : POST

body {

}

그러므로 다음과 같이 routes/router.js 에 다음과 같이 코드를 추가핞다.

```javascript
router.post("/confirm", function (req, res) {
    const check1 = req.body.check1;
    const check2 = req.body.check2;
    const check3 = req.body.check3;
    const check4 = req.body.check4;
    const check5 = req.body.check5;
    const car_id = req.body.car_id;
    const check_etc = "N/A";
    console.log("checketc = ", req.body.checketc);
    // if (!req.body.checketc) {
    //   check_etc = "N/A";
    // } else {
    //   check_etc = req.body.checketc;
    // }
    var check_time = moment().format("YYYYMMDDHHmmss");
  
    const checks = check1 + check2 + check3 + check4 + check5;
    console.log(car_id, checks, check_etc, check_time);
  
    if (!req.session.loggedIn) {
      res.redirect("/logout");
    } else {
      web3.eth.getAccounts(function(err, ass){
        if(err != null){
          console.log(err);
          return
        }
        if(ass.length == 0){
          console.log("Account defind")
        } else{
          smartcontract.methods
            .AddCheckList(car_id, checks, check_etc, parseInt(check_time))
            .send({
              from: ass[0],
              gas: 200000,
            })
            .then(function (receipt) {
              console.log(receipt);
              res.redirect("/car_list");
            });
        }
    })
  }
});

```





http://localhost:8080으로 접속하면 login이 되어 있으면 home.ejs가 랜더링 되도록 한다.'

로그인이 되어 있지 않으면 http://localhost:8080/logout 경로로 이동하도록 구현한다.

routes/router.js

```javascript
router.get("/" ,function(req, res){
  if(!req.session.loggedIn) {
    res.redirect('/logout')
  } else {
    var sql = "SELECT * FROM car_list";
    connection.query(sql, function (err, rows, fields) {
      if (err) {
        console.log("query is not excuted. select fail...\n" + err);
      } else {
        connection.query(
          "SELECT name, division FROM user_list where post_id = ?",
          [req.session.loggedIn.post_id],
          function (err, result, fields) {
            if (err) {
              console.log(err);
            } else {
                // console.log(req.session.loggedIn)
              res.render("home", {
                carlist: rows,
                userlist: result,
                user: req.session.loggedIn,
              });
            }
          }
        );
      }
    });
  }
  
})
```



http://localhost:8008/logout 경로로 이동하였을때 보여지는 서버를 구성하고 랜더링 되는 페이지를 구현한다.

```javascript
router.get("/logout", function (req, res) {
  if (!req.session.loggedIn) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
        res.render("error");
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/");
  }
});
```





url : http://localhost:8080/m_select_menu

method : GET

m_select_menu.ejs페이지 랜더링 된다

routes/router.js 다음과 같은 코드 추가

```javascript
router.get("/m_select_menu", function (req, res) {
  if (!req.session.loggedIn) {
    res.redirect("/logout");
  } else {
    connection.query(
      "SELECT name, division FROM user_list where post_id = ?",
      [req.session.loggedIn.post_id],
      function (err, result, fields) {
        if (err) {
          console.log(err);
        } else {
          res.render("m_select_menu", {
            userlist: result,
            user: req.session.loggedIn,
          });
        }
      }
    );
  }
});
```







views/m_select_menu.ejs 파일 생성후 다음과 같이 코드 구현한다.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Bus Safety System manager menu</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=no"
    />
    <link rel="stylesheet" href="/assets/css/main.css" />
  </head>
  <body class="is-preload" onload="menuload();">
    <!-- Wrapper -->
    <div id="wrapper">
      <!-- Main -->
      <div id="main">
        <div class="inner">
          <!-- Header -->
          <header id="header">
            <a href="index.html" class="logo"
              >Bus <strong>Safety</strong> System</a
            >
            <ul class="icons">
              <li>
                <a href="#" class="icon brands fa-twitter"
                  ><span class="label">Twitter</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-facebook-f"
                  ><span class="label">Facebook</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-snapchat-ghost"
                  ><span class="label">Snapchat</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-instagram"
                  ><span class="label">Instagram</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-medium-m"
                  ><span class="label">Medium</span></a
                >
              </li>
            </ul>
          </header>

          <!-- Content -->
          <section>
            <header class="main">
              <h1 id="m_select_menu_header">매니저 - 목록</h1>
            </header>
            <div id="m_select_menu_box">
              <ul class="actions fit">
                <li>
                  <a
                    href="/m_car_list"
                    class="button primary fit"
                    id="m_select_menu_button"
                    >차량 목록</a
                  >
                </li>
              </ul>
              <ul class="actions fit">
                <li>
                  <a
                    href="/m_check_list"
                    class="button fit"
                    id="m_select_menu_button"
                    >차량점검 내역</a
                  >
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
      <%- include ("./sidebar.ejs") %>
    </div>
    <!-- Scripts -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/browser.min.js"></script>
    <script src="assets/js/breakpoints.min.js"></script>
    <script src="assets/js/util.js"></script>
    <script src="assets/js/main.js"></script>
  </body>
</html>

```





![image-20201208213253741](https://user-images.githubusercontent.com/75194770/101489442-4cbff380-39a4-11eb-88af-19566d202f05.png)



#### 차량점검 내역을 누루면

url : http://localhost:8080/m_check_list

method : GET

routes/router.js 서버를 구성하는 코드를 구현하다.

```javascript
router.get("/m_check_list", function (req, res) {
  if (!req.session.loggedIn) {
    res.redirect("/logout");
  } else {
    var sql = "SELECT * FROM car_list";
    connection.query(sql, function (err, rows, fields) {
      if (err) {
        console.log("query is not excuted. select fail...\n" + err);
      } else {
        connection.query(
          "SELECT * FROM user_list where post_id = ?",
          [req.session.loggedIn.post_id],
          function (err, result, fields) {
            if (err) {
              console.log(err);
            } else {
              res.render("m_check_list", {
                carlist: rows,
                userlist: result,
                user: req.session.loggedIn,
              });
            }
          }
        );
      }
    });
  }
});
```



랜더링 되는 m_check_list.ejs파일을 views 폴더에 추가하고 다음과 같은 코드를 구현

```html
<!DOCTYPE html>
<!--
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
  <head>
    <title>Bus Safety System manager check list</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=no"
    />
    <link rel="stylesheet" href="/assets/css/main.css" />
    <script>
      function m_select_menu() {
        location.href = "/m_select_menu/";
      }
      function m_check_info(carnum) {
        location.href = "/m_checklist_detail1/" + carnum;
      }
    </script>
  </head>
  <body class="is-preload" onload="menuload();">
    <!-- Wrapper -->
    <div id="wrapper">
      <!-- Main -->
      <div id="main">
        <div class="inner">
          <!-- Header -->
          <header id="header">
            <a href="/" class="logo">Bus <strong>Safety</strong> System</a>
            <ul class="icons">
              <li>
                <a href="#" class="icon brands fa-twitter"
                  ><span class="label">Twitter</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-facebook-f"
                  ><span class="label">Facebook</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-snapchat-ghost"
                  ><span class="label">Snapchat</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-instagram"
                  ><span class="label">Instagram</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-medium-m"
                  ><span class="label">Medium</span></a
                >
              </li>
            </ul>
          </header>

          <!-- Content -->
          <section>
            <header class="main">
              <h1 id="m_check_list_header">매니저 - 검사 차량 목록</h1>
            </header>
            <div>
              <table>
                <thead>
                  <tr>
                    <th class="m_check_list_TableHead">차량 번호</th>
                    <th class="m_check_list_TableHead">소속</th>
                    <th class="m_check_list_TableHead">차량 종류</th>
                    <th class="m_check_list_TableHead">최종 검사일</th>
                    <th class="m_check_list_TableHead">최종 결과</th>
                  </tr>
                </thead>
                <tbody>
                  <!--for문-->
                  <% for (var i=0;i < carlist.length;i++) {%>
                  <tr onclick="m_check_info('<%=carlist[i].car_id%>')">
                    <td class="m_car_list_TableHead"><%=carlist[i].car_id%></td>
                    <td class="m_car_list_TableHead">
                      <%=carlist[i].car_div%>
                    </td>
                    <td class="m_car_list_TableHead">
                      <%=carlist[i].car_type%>
                    </td>
                    <td class="m_car_list_TableHead">
                      <%=carlist[i].car_birth%>
                    </td>
                    <td class="m_car_list_TableHead">
                      <%=carlist[i].car_day%>
                    </td>
                  </tr>
                  <% } %>
                  <!--for문 끝-->
                </tbody>
              </table>
            </div>
            <div id="m_check_list_button">
              <ul class="actions">
                <li>
                  <a
                    class="button primary"
                    id="m_check_list_button_ft"
                    onclick="m_select_menu()"
                    >메뉴로</a
                  >
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
      <%- include ("./sidebar.ejs") %>
    </div>

    <!-- Scripts -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/browser.min.js"></script>
    <script src="assets/js/breakpoints.min.js"></script>
    <script src="assets/js/util.js"></script>
    <script src="assets/js/main.js"></script>
  </body>
</html>

```





#### 차량목록을 누루면

url : http://localhost:8080/m_car_list

method : GET

routes/router.js 서버를 구성하는 코드를 구현하다.

```javascript
router.get("/m_car_list", function (req, res) {
  if (!req.session.loggedIn) {
    res.redirect("/logout");
  } else {
    var sql = "SELECT * FROM car_list";
    connection.query(sql, function (err, rows, fields) {
      if (err) {
        console.log("query is not excuted. select fail...\n" + err);
      } else {
        connection.query(
          "SELECT * FROM user_list where post_id = ?",
          [req.session.loggedIn.post_id],
          function (err, result, fields) {
            if (err) {
              console.log(err);
            } else {
              res.render("m_car_list", {
                carlist: rows,
                userlist: result,
                user: req.session.loggedIn,
              });
            }
          }
        );
      }
    });
  }
});
```



랜더링 되는 m_car_list.ejs파일을 views 폴더에 추가하고 다음과 같은 코드를 구현



```javascript
<!DOCTYPE html>
<!--
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
  <head>
    <title>Bus Safety System Car list</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=no"
    />
    <link rel="stylesheet" href="/assets/css/main.css" />
    <script>
      function m_add_car() {
        location.href = "/m_add_car/";
      }
      function m_car_info(carnum) {
        location.href = "/m_car_info/" + carnum;
      }
    </script>
  </head>
  <body class="is-preload" onload="menuload()">
    <!-- Wrapper -->
    <div id="wrapper">
      <!-- Main -->
      <div id="main">
        <div class="inner">
          <!-- Header -->
          <header id="header">
            <a href="/" class="logo"
              >Bus <strong>Safety</strong> System</a
            >
            <ul class="icons">
              <li>
                <a href="#" class="icon brands fa-twitter"
                  ><span class="label">Twitter</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-facebook-f"
                  ><span class="label">Facebook</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-snapchat-ghost"
                  ><span class="label">Snapchat</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-instagram"
                  ><span class="label">Instagram</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-medium-m"
                  ><span class="label">Medium</span></a
                >
              </li>
            </ul>
          </header>

          <!-- Content -->
          <section>
            <header class="main">
              <h1 id="m_car_list_header">매니저 - 차량 목록</h1>
            </header>
            <div>
              <table>
                <thead>
                  <tr>
                    <th class="m_car_list_TableHead">차량 번호</th>
                    <th class="m_car_list_TableHead">소속</th>
                    <th class="m_car_list_TableHead">차량 종류</th>
                    <th class="m_car_list_TableHead">연식</th>
                    <th class="m_car_list_TableHead">최종 검사일</th>
                  </tr>
                </thead>
                <tbody>
                  <% for (var i=0;i < carlist.length;i++) {%>
                  <tr onclick="m_car_info('<%=carlist[i].car_id%>')">
                    <td class="m_car_list_TableHead"><%=carlist[i].car_id%></td>
                    <td class="m_car_list_TableHead">
                      <%=carlist[i].car_div%>
                    </td>
                    <td class="m_car_list_TableHead">
                      <%=carlist[i].car_type%>
                    </td>
                    <td class="m_car_list_TableHead">
                      <%=carlist[i].car_birth%>
                    </td>
                    <td class="m_car_list_TableHead">
                      <%=carlist[i].car_day%>
                    </td>
                  </tr>
                  <% } %>
                </tbody>
              </table>
              <div id="m_car_list_button">
                <ul class="actions">
                  <li>
                    <a
                      class="button primary"
                      id="m_car_list_button_ft"
                      onclick="m_add_car()"
                      >추가</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
      <%- include ("./sidebar.ejs") %>
    </div>

    <!-- Scripts -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/browser.min.js"></script>
    <script src="assets/js/breakpoints.min.js"></script>
    <script src="assets/js/util.js"></script>
    <script src="assets/js/main.js"></script>
  </body>
</html>

```





#### 다음과 같은 차량점검내역 페이지에서

![image-20201208215154368](https://user-images.githubusercontent.com/75194770/101489659-97da0680-39a4-11eb-9536-5727314c83f6.png)


#### 각 목록을 누루면 점검 내역이 페이지로 이동되도록 구현 한다.

url : http://localhost:8080/m_checklist_detail1/car_id

method : GET

car_id 부분에 오는 것은 서버에서 params처리해 받는다.

##### routes/router.js

```javascript
router.get("/m_checklist_detail1/:car_id", function (req, res) {
  const carnum = req.params.car_id;
  if (!req.session.loggedIn) {
    res.redirect("/logout");
  } else {
    connection.query(
      "SELECT * FROM user_list where post_id = ?",
      [req.session.loggedIn.post_id],
      function (err, rows, fields) {
        if (err) {
          console.log("query is not excuted. select fail...\n" + err);
        } else {
          var check_array = new Array();
          smartcontract.methods
            .TotalCount()
            .call()
            .then(function (total_count) {
              for (var i = 0; i < total_count; i++) {
                smartcontract.methods
                  .GetCheck(i)
                  .call()
                  .then(function (result) {
                    if (result[1] == carnum) {
                      check_array.push(result);
                    }
                  });
              }

              setTimeout(() => {
                console.log(check_array);
                res.render("m_checklist_detail1", {
                  carlist: check_array,
                  carnum: carnum,
                  userlist: rows,
                  user: req.session.loggedIn,
                });
              }, 2000);
            });
        }
      }
    );
  }
});
```





m_checklist_detail1.ejs가 랜더링 되도록 구현한다.

views/m_checklist_detail1.ejs 추가하고 다음과 같이 코드를 구현한다.

```html
<!DOCTYPE html>
<!--
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
  <head>
    <title>Bus Safety System Check list</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=아니오"
    />
    <link rel="stylesheet" href="/assets/css/main.css" />
    <script>
      function m_check_list() {
        location.href = "/m_check_list/";
      }
    </script>
  </head>
  <body class="is-preload" onload="menuload();">
    <!-- Wrapper -->
    <div id="wrapper">
      <!-- Main -->
      <div id="main">
        <div class="inner">
          <!-- Header -->
          <header id="header">
            <a href="/" class="logo"
              >Bus <strong>Safety</strong> System</a
            >
            <ul class="icons">
              <li>
                <a href="#" class="icon brands fa-twitter"
                  ><span class="label">Twitter</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-facebook-f"
                  ><span class="label">Facebook</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-snapchat-ghost"
                  ><span class="label">Snapchat</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-instagram"
                  ><span class="label">Instagram</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-medium-m"
                  ><span class="label">Medium</span></a
                >
              </li>
            </ul>
          </header>

          <!-- Content -->
          <section>
            <header class="main">
              <h1 id="m_check_list_detail_header">매니저 - 검사 상세 내용</h1>
            </header>
            <div id="m_check_list_detail_division">
              <span id="m_check_list_detail_division1"
                >차량 번호:<strong><%=carnum%></strong></span
              ><span id="m_check_list_detail_division2"
                >차량 소속:<strong></strong
              ></span>
            </div>
            <br />
            <div>
              <table>
                <thead>
                  <tr>
                    <th class="m_check_list_detail_TableHead">검사 일</th>
                    <th class="m_check_list_detail_TableHead">내용</th>
                    <th class="m_check_list_detail_TableHead">검사 결과</th>
                  </tr>
                </thead>
                <tbody>
                  <!--for문-->
                  <%if (carlist.length == 0){ %>
                  <tr>
                    <td class="m_check_list_detail_TableHead" colspan="3">
                      점검내역이 존재하지 않습니다.
                    </td>
                  </tr>
                  <% } else { for(var i=0; i < carlist.length; i++){%>
                  <tr>
                    <td class="m_check_list_detail_TableHead">
                      <%=carlist[i][4]%>
                    </td>
                    <td class="m_check_list_detail_TableHead">
                      <%=carlist[i][3]%>
                    </td>
                    <td class="m_check_list_detail_TableHead">
                      <%if (carlist[i][2] == 'ttttt'){%> pass <%} else {%>
                      failure <%}%>
                    </td>
                  </tr>
                  <%}}%>
                  <!--for문 끝-->
                </tbody>
              </table>
              <!--표시할 내용이 없을때 사용-->
              <!-- <table>
                <thead>
                  <tr>
                    <th class="m_check_list_detail_TableHead">검사 일</th>
                    <th class="m_check_list_detail_TableHead">내용</th>
                    <th class="m_check_list_detail_TableHead">검사 결과</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="m_check_list_detail_TableHead" colspan="3">
                      표시할 내용이 없습니다.
                    </td>
                  </tr>
                </tbody>
              </table> -->
            </div>
            <br />
            <br />
            <div id="m_check_list_detail_button">
              <ul class="actions">
                <li>
                  <a
                    class="button"
                    id="check_list_button_ft"
                    onclick="m_check_list()"
                    >확인</a
                  >
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>

      <%- include ("./sidebar.ejs") %>
    </div>

    <!-- Scripts -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/browser.min.js"></script>
    <script src="assets/js/breakpoints.min.js"></script>
    <script src="assets/js/util.js"></script>
    <script src="assets/js/main.js"></script>
  </body>
</html>

```



#### 다음과 같은 차량점검내역 페이지에서

![image-20201208215154368](C:\Users\82108\AppData\Roaming\Typora\typora-user-images\image-20201208215154368.png)

#### 각 목록을 누루면 점검 내역이 페이지로 이동되도록 구현 한다.

url : http://localhost:8080/m_car_info/car_id

method : GET

car_id 부분에 오는 것은 서버에서 params처리해 받는다.

##### routes/router.js

```javascript
router.get("/m_car_info/:car_id", function (req, res) {
  if (!req.session.loggedIn) {
    res.redirect("/logout");
  } else {
    const carnum = req.params.car_id;
    connection.query(
      "SELECT * FROM car_list where car_id = ?",
      [carnum],
      function (err, rows, fields) {
        if (err) {
          console.log("query is not excuted. select fail...\n" + err);
        } else {
          connection.query(
            "SELECT name, division FROM user_list where post_id = ?",
            [req.session.loggedIn.post_id],
            function (err, result, fields) {
              if (err) {
                console.log(err);
              } else {
                res.render("m_car_info", {
                  carlist: rows,
                  userlist: result,
                  user: req.session.loggedIn,
                });
              }
            }
          );
        }
      }
    );
  }
});
```



##### m_car_info.ejs가 랜더링 되도록 구현한다.

##### views/m_car_info.ejs 추가하고 다음과 같이 코드를 구현한다.

```html
<!DOCTYPE html>
<!--
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
  <head>
    <title>Bus Safety System Check manager car info</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=아니오"
    />
    <link rel="stylesheet" href="/assets/css/main.css" />
    <script>
      function m_add_car_update(num) {
        location.href = "/m_add_car_update/" + num;
      }
    </script>
  </head>
  <body class="is-preload" onload="menuload();">
    <!-- Wrapper -->
    <div id="wrapper">
      <!-- Main -->
      <div id="main">
        <div class="inner">
          <!-- Header -->
          <header id="header">
            <a href="/" class="logo"
              >Bus <strong>Safety</strong> System</a
            >
            <ul class="icons">
              <li>
                <a href="#" class="icon brands fa-twitter"
                  ><span class="label">Twitter</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-facebook-f"
                  ><span class="label">Facebook</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-snapchat-ghost"
                  ><span class="label">Snapchat</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-instagram"
                  ><span class="label">Instagram</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-medium-m"
                  ><span class="label">Medium</span></a
                >
              </li>
            </ul>
          </header>

          <!-- Content -->
          <section>
            <form method="post" action="/confirm"></form>
            <header class="main">
              <h1 id="m_car_info_header">차량 상세 정보</h1>
            </header>
            <div id="m_car_info_division">
              <span id="m_car_info_division1"
                >차량 번호:<input
                  name="car_id"
                  value="<%=carlist[0].car_id%>"
                  readonly /><strong></strong></span
              ><span id="m_car_info_division2"
                >차량 소속:<input
                  name="car_id"
                  value="<%=carlist[0].car_div%>"
                  readonly />
                <strong></strong
              ></span>
            </div>
            <br />
            <table class="alt">
              <tr>
                <td id="m_car_info_table">
                  차량 번호
                </td>
                <td id="m_car_info_table2">
                  <span><%=carlist[0].car_id%></span>
                </td>
                <td id="m_car_info_table">차량 종류</td>
                <td id="m_car_info_table2">
                  <span><%=carlist[0].car_type%></span>
                </td>
              </tr>
              <tr>
                <td id="m_car_info_table">차량 연식</td>
                <td id="m_car_info_table2">
                  <span><%=carlist[0].car_birth%></span>
                </td>
                <td id="m_car_info_table">최종 검사일</td>
                <td id="m_car_info_table2">
                  <span><%=carlist[0].car_birth%></span>
                </td>
              </tr>
            </table>
            <div class="col-12">
              <textarea
                name="demo-message"
                id="m_car_info_massage"
                placeholder="기타 사항"
                rows="10"
              ></textarea>
            </div>
            <br />
            <br />
            <div id="confirm_button">
              <ul class="actions">
                <li>
                  <a
                    class="button primary"
                    id="confirm_button_ft"
                    href="/m_car_info/delete/<%=carlist[0].car_id%>"
                    >삭제</a
                  >
                </li>
                <li>
                  <a
                    class="button"
                    id="confirm_button_ft"
                    onclick="m_add_car_update('<%=carlist[0].car_id%>');"
                    >수정</a
                  >
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
      <%- include ("./sidebar.ejs") %>
    </div>

    <!-- Scripts -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/browser.min.js"></script>
    <script src="assets/js/breakpoints.min.js"></script>
    <script src="assets/js/util.js"></script>
    <script src="assets/js/main.js"></script>
  </body>
</html>

```



![image-20201208215650171](https://user-images.githubusercontent.com/75194770/101489717-ae805d80-39a4-11eb-9728-092b6e979d2b.png)



수정기능을 구현하기 구현하기 위해 다음과 같은 코드를 구현하다.

url:http://localhost:8080/m_add_car_update/car_id

method: GET

routes/router.js 다음과 같은 코드를 구현한다.

```javascript
router.get("/m_add_car_update/:car_id", function (req, res) {
  if (!req.session.loggedIn) {
    res.redirect("/logout");
  } else {
    const carnum = req.params.car_id;
    connection.query(
      "SELECT * FROM car_list where car_id = ?",
      [carnum],
      function (err, rows, fields) {
        if (err) {
          console.log("query is not excuted. select fail...\n" + err);
        } else {
          connection.query(
            "SELECT name, division FROM user_list where post_id = ?",
            [req.session.loggedIn.post_id],
            function (err, result, fields) {
              if (err) {
                console.log(err);
              } else {
                res.render("m_add_car_update", {
                  carlist: rows,
                  userlist: result,
                  user: req.session.loggedIn,
                });
              }
            }
          );
        }
      }
    );
  }
});
```





views/m_add_car_update.ejs 구현



```html
<!DOCTYPE html>
<html>
  <head>
    <title>Bus Safety System manager add car update</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=no"
    />
    <link rel="stylesheet" href="/assets/css/main.css" />
    <script>
      function m_car_info(num) {
        location.href = "/m_car_info/"+ num;
      }
      function m_car_list() {
        location.href = "/m_car_list/"
      }
    </script>
  </head>
  <body class="is-preload" onload="menuload();">
    <!-- Wrapper -->
    <div id="wrapper">
      <!-- Main -->
      <div id="main">
        <div class="inner">
          <!-- Header -->
          <header id="header">
            <a href="/" class="logo"
              >Bus <strong>Safety</strong> System</a
            >
            <ul class="icons">
              <li>
                <a class="icon brands fa-twitter"
                  ><span class="label">Twitter</span></a
                >
              </li>
              <li>
                <a class="icon brands fa-facebook-f"
                  ><span class="label">Facebook</span></a
                >
              </li>
              <li>
                <a class="icon brands fa-snapchat-ghost"
                  ><span class="label">Snapchat</span></a
                >
              </li>
              <li>
                <a class="icon brands fa-instagram"
                  ><span class="label">Instagram</span></a
                >
              </li>
              <li>
                <a class="icon brands fa-medium-m"
                  ><span class="label">Medium</span></a
                >
              </li>
            </ul>
          </header>

          <!-- Content -->
          <form method="post" action="/m_add_car_update">
          <section id="banner">
            <div class="content">
              <p id="m_add_car_join">
                <h1 id="m_add_car_head">차량 정보 수정</h1>
                  <div class="col-6 col-12-xsmall">
                    <input type="text" name="car_id" id="m_add_car_text" value="<%=carlist[0].car_id%>" placeholder="차량 번호" />
                  </div>
                  <br><br>
                  <div class="col-6 col-12-xsmall">
                    <input type="text" name="car_div" id="m_add_car_text" value="<%=carlist[0].car_div%>" placeholder="차량 소속" />
                  </div>
                  <br><br>
                  <div class="col-6 col-12-xsmall">
                    <input type="text" name="car_type" id="m_add_car_text" value="<%=carlist[0].car_type%>" placeholder="차량 종류" />
                  </div>
                  <br><br>
                  <div class="col-6 col-12-xsmall">
                    <input type="text" name="car_birth" id="m_add_car_text" value="<%=carlist[0].car_birth%>" placeholder="차량 연식" />
                  </div>
                  <br><br>
                  <div class="col-6 col-12-xsmall">
                    <input type="text" name="car_day" id="m_add_car_text" value="<%=carlist[0].car_day%>" placeholder="최종 검사일" />
                  </div>
                  <br><br>
                  <div class="col-6 col-12-xsmall">
                    <textarea name="var_result" id="m_add_car_massage" placeholder="기타 사항" rows="10"></textarea>
                  </div>
                  <br><br>
                  <div id="m_add_car_button">
                    <ul class="actions">
                      <li><a class="button" id="m_add_car_button_ft" onclick="m_car_info('<%=carlist[0].car_id%>');">취소</a></li>
                      <li><button type="submit" class="button primary"id="m_add_car_button_ft">저장</button></li>
                    </ul>
                  </div>
                
              </p>
            </div>
            
          </section>
        </form>
        </div>
      </div>
      <%- include ("./sidebar.ejs") %>
    </div>

    <!-- Scripts -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/browser.min.js"></script>
    <script src="assets/js/breakpoints.min.js"></script>
    <script src="assets/js/util.js"></script>
    <script src="assets/js/main.js"></script>
  </body>
</html>

```





![image-20201208220203793](https://user-images.githubusercontent.com/75194770/101489889-ebe4eb00-39a4-11eb-9474-e7ed4df20915.png)


위와 같은 페이지에서 저장 버튼을 누루면 update되도록 하는 서버를 구현한다.

routes/router.js에 추가

```javascript
router.post("/m_add_car_update", function (req, res) {
  if (!req.session.loggedIn) {
    res.redirect("/logout");
  } else {
    connection.query(
      `select * from user_list where post_id = ?`,
      [req.session.loggedIn.post_id],
      function (err, result) {
        if (err) {
          res.render("error");
        } else {
          const car_id = req.body.car_id;
          const car_div = req.body.car_div;
          const car_type = req.body.car_type;
          const car_birth = req.body.car_birth;
          const car_day = req.body.car_day;
          const var_result = req.body.var_result;

          connection.query(
            "UPDATE car_list SET car_id = ?, car_div = ?, car_type = ?, car_birth = ?, car_day = ?, var_result = ? where car_id = ?",
            [car_id, car_div, car_type, car_birth, car_day, var_result, car_id],
            function (err, rows, next) {
              if (err) {
                console.log(err);
              } else {
                res.redirect("/m_car_list");
              }
            }
          );
        }
      }
    );
  }
});
```



#### 다음과 같은 차량점검내역 페이지에서

![image-20201208220703128](https://user-images.githubusercontent.com/75194770/101489945-00c17e80-39a5-11eb-93a1-30adea2bc8bf.png)



추가 버튼을 누루면 차량 추가 페이지 랜더링하고 추가할 수 있는 기능을 추가 

![image-20201208220705688](https://user-images.githubusercontent.com/75194770/101489947-015a1500-39a5-11eb-9743-942a848b74dd.png)

routes/router.js 코드 추가 

```javascript
router.get("/m_add_car", function (req, res) {
  if (!req.session.loggedIn) {
    res.redirect("/logout");
  } else {
    var sql = "SELECT * FROM car_list";
    connection.query(sql, function (err, rows, fields) {
      if (err) {
        console.log("query is not excuted. select fail...\n" + err);
      } else {
        connection.query(
          "SELECT * FROM user_list where post_id = ?",
          [req.session.loggedIn.post_id],
          function (err, result, fields) {
            if (err) {
              console.log(err);
            } else {
              res.render("m_add_car", {
                carlist: rows,
                userlist: result,
                user: req.session.loggedIn,
              });
            }
          }
        );
      }
    });
  }
});
```





views/m_add_car.ejs

```html
<!DOCTYPE html>
<!--
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
  <head>
    <title>Bus Safety System Car list</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=no"
    />
    <link rel="stylesheet" href="/assets/css/main.css" />
    <script>
      function m_car_list() {
        location.href = "/m_car_list/";
      }
    </script>
  </head>
  <body class="is-preload" onload="menuload()">
    <!-- Wrapper -->
    <div id="wrapper">
      <!-- Main -->
      <div id="main">
        <div class="inner">
          <!-- Header -->
          <header id="header">
            <a href="index.html" class="logo"
              >Bus <strong>Safety</strong> System</a
            >
            <ul class="icons">
              <li>
                <a href="#" class="icon brands fa-twitter"
                  ><span class="label">Twitter</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-facebook-f"
                  ><span class="label">Facebook</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-snapchat-ghost"
                  ><span class="label">Snapchat</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-instagram"
                  ><span class="label">Instagram</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands fa-medium-m"
                  ><span class="label">Medium</span></a
                >
              </li>
            </ul>
          </header>

          <!-- Content -->
          <section id="banner">
            <div class="content">
              <form method="POST" action="/m_add_car">
              <p id="m_add_car_join">
                <h1 id="m_add_car_head">차량 추가</h1>
                  <div class="col-6 col-12-xsmall">
                    <input type="text" name="car_id" id="m_add_car_text" placeholder="차량 번호" />
                  </div>
                  <br><br>
                  <div class="col-6 col-12-xsmall">
                    <input type="text" name="car_div" id="m_add_car_text" placeholder="차량 소속" />
                  </div>
                  <br><br>
                  <div class="col-6 col-12-xsmall">
                    <input type="text" name="car_type" id="m_add_car_text"  placeholder="차량 종류" />
                  </div>
                  <br><br>
                  <div class="col-6 col-12-xsmall">
                    <input type="text" name="car_birth" id="m_add_car_text"  placeholder="차량 연식" />
                  </div>
                  <br><br>
                  <div class="col-6 col-12-xsmall">
                    <input type="text" name="car_day" id="m_add_car_text" placeholder="최종 검사일" />
                  </div>
                  <br><br>
                  <div class="col-12">
                    <textarea name="var_result" id="m_add_car_massage" placeholder="기타 사항" rows="10"></textarea>
                  </div>
                  <br><br>
                  <div id="m_add_car_button">
                    <ul class="actions">
                      <li><a class="button" id="m_add_car_button_ft"onclick="m_car_list()">취소</a></li>
                      <li><button
                        type="submit"
                        class="button"
                        id="check_list_button_ft"
                      >
                        저장
                      </button></li>
                    </ul>
                  </div>
              </p>
            </form>
            </div>
          </section>
        </div>
      </div>

      <%- include ("./sidebar.ejs") %>
    </div>

    <!-- Scripts -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/browser.min.js"></script>
    <script src="assets/js/breakpoints.min.js"></script>
    <script src="assets/js/util.js"></script>
    <script src="assets/js/main.js"></script>
  </body>
</html>

```





#### 목록을 작성하고 저장 버튼을 누루면 저장될 수 있는 기능 구현

routes/router.js

```javascript
router.post("/m_add_car", function (req, res) {
  const car_id = req.body.car_id;
  const car_div = req.body.car_div;
  const car_type = req.body.car_type;
  const car_birth = req.body.car_birth;
  const car_day = req.body.car_day;
  const var_result = req.body.var_result;
  console.log(car_id, car_div, car_type, car_birth, car_day, var_result);

  if (!req.session.loggedIn) {
    res.redirect("/logout");
  } else {
    connection.query(
      `INSERT INTO car_list (car_id, car_div, car_type, car_birth, car_day, var_result)
                values (?, ?, ?, ?, ?, ?)`,
      [car_id, car_div, car_type, car_birth, car_day, var_result],
      function (err, result) {
        if (err) {
          console.log("error");
        } else {
          res.redirect("m_car_list");
        }
      }
    );
  }
});


```


![image-20201208221119956](https://user-images.githubusercontent.com/75194770/101489949-028b4200-39a5-11eb-9497-346426fa41d8.png)


삭제버튼 구현

routes/router.js 코드 추가

```javascript
app.get("/m_car_info/delete/:num", function (req, res) {
  if (!req.session.loggedIn) {
    res.redirect("/logout");
  } else {
    const carnum = req.params.num;
    connection.query(
      `delete from car_list where car_id = ?`,
      [carnum],
      function (err, result) {
        if (err) {
          console.log(err);
          res.render("error");
        } else {
          var sql = "SELECT * FROM car_list";
          connection.query(sql, function (err, rows, fields) {
            if (err) {
              console.log("query is not excuted. select fail...\n" + err);
            } else {
              connection.query(
                "SELECT name, post_id FROM user_list where post_id = ?",
                [req.session.loggedIn.post_id],
                function (err, result, fields) {
                  if (err) {
                    console.log(err);
                  } else {
                    res.render("m_Car_list", {
                      carlist: rows,
                      userlist: result,
                      user: req.session.loggedIn,
                    });
                  }
                }
              );
            }
          });
        }
      }
    );
  }
});

```





