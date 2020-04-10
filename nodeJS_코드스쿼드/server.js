const express = require('express');
const bodyParser = require('body-parser'); // Post data받기
const app = express();
const port = 3000;

// app method 내 느낌대로
// 1. use : 기본값으로 설정할 내용
// 2. get : 특정 url에 따른 응답값
// 3. post : form post로 보내진 값 수령
// 4. set : 특정 변수를 첫번째 인자로 선언하고, 그 값을 두번째에

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json()); // Json으로 오거나
app.use(bodyParser.urlencoded({extended : true})); // Json외로 오거나
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/public/main.html');
})

app.get('/sign_up', (req, res) => {
  res.sendFile(__dirname+'/public/form.html');
})

app.post('/sign_up_process', (req, res) => {
  id = req.body.id;
  // const pw = req.body.pw;
  res.render('welcome.ejs', {id : id});
})

app.listen(port, () => {
  console.log(`Server connected on port ${port}!`);
});