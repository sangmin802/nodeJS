const express = require('express');
const app = express();
const fs = require('fs');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const bodyParser = require('body-parser');
const compression = require('compression');

app.use(bodyParser.urlencoded({extended : false}));
app.use(compression());
// 미들웨어 만들기
// var myLogger = function (req, res, next) {
//   console.log('LOGGED')
//   next()
// }

// app.use(myLogger)
// 공식 사이트에서 예시로 보여준 미들웨어이다.
// 이로서, 미들웨어는 함수를 통해 생성되는것을 알 수 있다.
app.get('*', (req, res, next) => {
  fs.readdir('./data', (err, filelist) => {
    req.list = filelist;
    next();
  })
})
// 1. 현재 우리는, app.get 혹은 app.post를 할 때에, fs.readdir이 반복적으로 사용되는것을 볼 수 있다.
// 2. 그렇다면, 이 method를 nodejs가 실행되자마자 먼저 실행시켜서 값을 담아주면 편해질 것이다.
// 3. req, res, next는 필수 인자이며, fs.readdir을 통해 req.list = filelist라고 지정을 해주자.
// 4. 그리고 next()를 통해, 이 다음 미들웨어가 실행되도록 설정한다.
// ex ) 안쓰면 다음 미들웨어는 실행 안됨. 안쓰고 새로고침하니깐, 그냥 진행표시만뜨고 안뜸.
// 5. 하지만 post방식에서는 filelist를 가져올 필요가 없기 때문에, use -> get으로 바꾸고 첫번째 인자로 '*'를 해주어 모든 get방식에서만 사용되어라.
// ex ) app.use()... 모든곳에서 사용
// ex ) app.use('/index')... /index에서만 사용
// ex ) app.get()... get에서만 사용  
// ex ) app.get('/index')... get에서 /index에서만 사용
// -> 첫번째 인자는 경로이다(*도 그냥 모든곳이라는 경로)
// 6. app.???(미들웨어함수, 미들웨어함수) 이렇게 한번에 여러개 입력도 가능하다.
// 결론) 근데 바꾸고나니, 지금까지 app.get을 한거랑 매우 비슷하게생김. 즉. 우리가 지금까지 두번재 인자로 콜백함수를 넣어준 것 또한, 미들웨어였다는것을 알 수 있다.

app.get('/', (req, res) => { 
  const title = 'Welcome';
  const description = 'Hello, Node.js';
  const list = template.list(req.list);
  const html = template.HTML(title, list,
    `<h2>${title}</h2>${description}`,
    `<a href="/create">create</a>`
  );
  res.send(html);
});

app.get('/page/:pageId', (req, res) => {
  const filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`./data/${filteredId}`, 'utf8', (err2, description) => {
    if(!err2){
      const sanitizedTitle = sanitizeHtml(filteredId);
      const sanitizedDescription = sanitizeHtml(description);
      const list = template.list(req.list);
      const html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        `
        <a href="/create">create</a>
        <a href="/update/${sanitizedTitle}">update</a>
        <form action="/delete_process" method="post">
          <input type="hidden" name="id" value="${sanitizedTitle}">
          <input type="submit" value="delete">
        </form>
        `
      );
      res.send(html);
    };
  });
});

app.get('/create', (req, res) => {
  const title = 'Create';
  const list  = template.list(req.list);
  const html = template.HTML(title, list, `
  <h2>${title}</h2>
  <form action="/create_process" method="post">
    <p><input type="text" name="title" placeholder="title"></p>
    <p>
      <textarea name="description" placeholder="description"></textarea>
    </p>
    <p>
      <input type="submit" value="create">
    </p>
  </form>
  `, ``);
  res.send(html);
});

app.post('/create_process', (req, res) => {
  const post = req.body;
  fs.writeFile(`./data/${post.title}`, post.description, 'utf8', (err) => {
    if(!err){
      res.redirect(`/page/${post.title}`);
    };
  });
});

app.get('/update/:pageId', (req, res) => {
  const filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`./data/${filteredId}`, 'utf8', (err2, description) => {
    if(!err2){
      const title = 'Update';
      const list = template.list(req.list);
      const html = template.HTML(title, list, `
      <h2>${title}</h2>
      <form action="/update_process" method="post">
        <input type="hidden" name="id" value="${sanitizeHtml(filteredId)}">
        <p>
          <input type="text" name="title" value="${sanitizeHtml(filteredId)}">
        </p>
        <p>
          <textarea name="description">${sanitizeHtml(description)}</textarea>
        </p>
        <input type="submit" value="update">
      </form>
      `, ``);
      res.send(html);
    };
  });
});

app.post('/update_process', (req, res) => {
  const post = req.body;
  fs.rename(`./data/${post.id}`, `./data/${post.title}`, (err) => {
    fs.writeFile(`./data/${post.title}`, post.description, 'utf8', (err2) => {
      if(!err && !err2){
        res.redirect(`/page/${post.title}`);
      };
    });
  })
});

app.post('/delete_process', (req, res) => {
  const post = req.body;
  fs.unlink(`./data/${post.id}`, (err) => {
    if(!err){
      res.redirect('/');
    }
  })
});

app.listen(3000);