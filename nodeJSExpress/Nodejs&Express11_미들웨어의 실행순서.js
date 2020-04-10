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
app.get('*', (req, res, next) => {
  fs.readdir('./data', (err, filelist) => {
    req.list = filelist;
    next();
    // next('route');
  });
}, (req, res, next) => {
    res.send('실행되었다.');
});

// 1. 여러개의 미들웨어실행함수가 들어갈 수 있다.
// 2. 미들웨어에서, 특정조건을 통해 다음 미들웨어가 실행될지 안될지 막을 수 있다.
// 3. 또한, 특정조건 혹은 개발자의 의지대로, next('route')를 통해 같이있는 미들웨어를 패스시킬 수 있다.

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