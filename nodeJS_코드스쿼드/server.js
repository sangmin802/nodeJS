const express = require('express');
const bodyParser = require('body-parser'); // Post data받기
const router = require('./router/routes.js');
const session = require('express-session');
const passport = require('passport');
const app = express();
const port = 3000;
const db = require('./db.js');
db.connect();

app.set('view engine', 'ejs');

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json()); // Json으로 오거나
app.use(bodyParser.urlencoded({extended : true})); // Json외로 오거나
app.use(session({
  secret : 'userName',
  resava : false,
  saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

app.listen(port, () => {
  console.log(`Server connected on port ${port}!`);
});

// jwt로 인증하는것도 하긴했는데, jwt하면 ejs에 값을 옯겨줄수가 없음.
// 존나찾아봤는데 안보임. 그냥 ejs안쓰는게 제일 현명한것같음