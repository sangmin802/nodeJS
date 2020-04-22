const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = 3000;
const app = express();
const index = require('./routes/index.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

app.use(cookieParser()); // 브라우저에 저장된 Cookie를 쉽게 조회할 수 있음

app.use('/', index);

app.listen(port, () => {
  console.log(`Server is connected on port${port}!`)
})