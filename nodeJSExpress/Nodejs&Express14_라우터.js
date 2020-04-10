const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const topicRouter = require('./routes/topic.js');
const indexRouter = require('./routes/index.js');

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(compression());
app.get('*', (req, res, next) => {
  fs.readdir('./data', (err, filelist) => {
    req.list = filelist;
    next();
  });
});

app.use('/', indexRouter);
// 문제) topic으로 모두 바꿔주게되면서, 오류가생겼던게, create를 누르면 err창이 떴다.
// 해결) create를 pageId를 읽는 미들웨어보다 위에다가 옮겨서 해결되었는데, 이유는 처음 pageId를 읽는것이 가장 먼저 써져있어서 가장 먼저 실행이되어 create를 눌렀을 때 그 create가 pageId로 읽혀지게되면서 err가 생기는 것이다.
// 따라서, create을 눌렀을 때 req.params가 아니라 순수 create란걸 먼저 반응할 수 있도록 create를 더 위에다가 옮겨준 것이다.
// nodejs의 미들웨어는 이렇게 써지는 순서가 중요하다는것을 알 수 있다.

// router file로 분리.
app.use('/topic', topicRouter);
// 1. routes dir을 만들고, topic.js파일을 만든다. (앞으로 라우팅시작에 /topic이 들어가면, 해당 파일의 명령문들중에서 탐색을 먼저 해라)
// 2. topicRouter는 ./routes/topic.js로부터 받아온 모듈.
// 3. topic.js에서도 express를 사용하기 때문에, application객체를 받아오고, 특이하게 topic.js에서는 application객체에서 express method를 사용하는것이아니라 express.Router() 를 실행시키고, 해당 객체를 router(임의의 변수)에 리턴받는다.
// 4. 기존 app. 이였던 것들은 모두 router.으로 변경되고, 기존 라우팅에 /topic들은 모두 지워준다. 왜나면, 기본적으로 main.js에서 시작이 /topic인거 알고 찾아들어갔기 때문이다.
// 5. 단! create_process등은 새롭게 라우팅을 탐색하여 다시시작하는 것 이므로, main.js에서 다시 /topic인걸 알 수 있게 앞에 /topic을 유지시켜준다.

app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});

app.use((err, req, res, next) => {
  res.status(500).send('Something broke!');
});

app.listen(3000);