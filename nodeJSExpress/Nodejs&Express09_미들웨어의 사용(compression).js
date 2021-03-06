const express = require('express');
const app = express();
const fs = require('fs');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const bodyParser = require('body-parser');
const compression = require('compression');

app.use(bodyParser.urlencoded({extended : false}));
// 1. 미들웨어 compression : 사용자에게 데이터를 보여줄 때에, 많은양의 데이터라면 큰 용량에 의해 비용과 시간이 많이든다. 그럴 때에, 압축을 해서 데이터를 보내고, 푸는 방법을 브라우저에게 요청을 하면 (zip처럼) 획기적으로 작은 용량으로 처리를 할 수 있다.
// npm install compression --save
app.use(compression());

app.get('/', (req, res) => { 
  fs.readdir('./data', (err, filelist) => {
    if(!err){
      const title = 'Welcome';
      const description = 'Hello, Node.js';
      const list = template.list(filelist);
      const html = template.HTML(title, list,
        `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a>`
      );
      res.send(html);
    };
  });
});

app.get('/page/:pageId', (req, res) => {
  fs.readdir('./data', (err, filelist) => {
    const filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`./data/${filteredId}`, 'utf8', (err2, description) => {
      if(!err && !err2){
        const sanitizedTitle = sanitizeHtml(filteredId);
        const sanitizedDescription = sanitizeHtml(description);
        const list = template.list(filelist);
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
});

app.get('/create', (req, res) => {
  fs.readdir('./data', (err, filelist) => {
    if(!err){
      const title = 'Create';
      const list  = template.list(filelist);
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
    };
  });
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
  fs.readdir('./data', (err, filelist) => {
    const filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`./data/${filteredId}`, 'utf8', (err2, description) => {
      if(!err && !err2){
        const title = 'Update';
        const list = template.list(filelist);
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