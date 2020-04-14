const express = require('express');
const bodyParser = require('body-parser'); // Post data받기
const router = require('./router/routes.js');
const session = require('express-session');
const app = express();
const port = 3000;
const db = require('./db.js');
db.connect();

// app method 내 느낌대로
// 1. use : 기본값으로 설정할 내용
// 2. get : 특정 url에 따른 응답값
// 3. post : form post로 보내진 값 수령
// 4. set : 첫번째에 사용할 기능을 선언, 그 값을 두번째에

app.use(express.static(__dirname+'/public'));

// fetch post가아닌 form post의 경우, 아래의 두 조건으로인해, req.body로 바로조회 가능하다.
app.use(bodyParser.json()); // Json으로 오거나
app.use(bodyParser.urlencoded({extended : true})); // Json외로 오거나

// express-session 모듈을 통해 node.js에서 session storage랑 비슷한 기능을 사용할 수 있다. req.session을 통해 정보입력, 출력 가능
// 입력된 정보가 localstorage처럼 상시남아있어서, req.session.destroy();를 꼭 선언해줘야한다.
app.use(session({
  secret : 'sangmin',
  resava : true,
  saveUninitialized : true
}))

app.set('view engine', 'ejs');

app.use(router);

app.listen(port, () => {
  console.log(`Server connected on port ${port}!`);
});