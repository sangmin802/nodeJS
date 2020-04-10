const express = require('express');
const app = express();
const fs = require('fs');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const bodyParser = require('body-parser');
const compression = require('compression');

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(compression());
app.get('*', (req, res, next) => {
  fs.readdir('./data', (err, filelist) => {
    req.list = filelist;
    next();
  });
});

app.get('/', (req, res) => { 
  const title = 'Welcome';
  const description = 'Hello, Node.js';
  const list = template.list(req.list);
  const html = template.HTML(title, list,
    `<h2>${title}</h2>${description}<img src="/images/hello.jpg">`,
    `<a href="/create">create</a>`
  );
  res.send(html);
});

app.get('/page/:pageId', (req, res, next) => {
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
    }else{
      next(err2);
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

// 1. 미들웨어는 순차적으로 진행되는데, 마지막까지 찾아서 없을 경우여서 맨 아래에 쓰는 것이다.
// 2. 혹은, 특정 파일을 읽어올 때, err를 받아오는데, 그 err일때 next인자를 추가해주고, next(err2);
app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});

// 3. next(err)로 뜨는 창의 내용을 바꾸고 싶을 때, 2번의 경우 next(err)를 보내는데 따라서 첫번째 인자로 err가 오게된다.
app.use((err, req, res, next) => {
  res.status(500).send('Something broke!');
});

app.listen(3000);