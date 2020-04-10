const express = require('express');
const app = express();
const fs = require('fs');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const qs = require('querystring');

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
          <form action="delete_process" method="post">
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
  let body = '';
  req.on('data', (data) => {
      body = body + data;
  });
  req.on('end', () => {
    const post = qs.parse(body);
    fs.writeFile(`./data/${post.title}`, post.description, 'utf8', (err) => {
      if(!err){
        res.writeHead(302, {Location : `/page/${post.title}`});
        res.end();
      };
    });
  });
});

// 1. 기존, ?로시작하는 querystirng으로 받아오는것이아닌 param으로 받아오기위해 받는곳에서는 /:처리로 변경
// 2. 그 외는 기존과 동일

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
  let body = '';
  req.on('data', (data) => {
    body = body + data;
  });
  req.on('end', () => {
    const post = qs.parse(body);
    fs.rename(`./data/${post.id}`, `./data/${post.title}`, (err) => {
      fs.writeFile(`./data/${post.title}`, post.description, 'utf8', (err2) => {
        if(!err && !err2){
          res.writeHead(302, {Location : `/page/${post.title}`});
          res.end();
        };
      });
    });
  });
});

app.listen(3000, () => console.log(`Example app listening on port 3000!`));
// var http = require('http');
// var fs = require('fs');
// var url = require('url');
// var qs = require('querystring');
// var template = require('./lib/template.js');
// var path = require('path');
// var sanitizeHtml = require('sanitize-html');

// var app = http.createServer(function(request,response){
//     var _url = request.url;
//     var queryData = url.parse(_url, true).query;
//     var pathname = url.parse(_url, true).pathname;
//     if(pathname === '/'){
//     } else if(pathname === '/create'){
//     } else if(pathname === '/create_process'){
//     } else if(pathname === '/update'){
//     } else if(pathname === '/update_process'){
//     } else if(pathname === '/delete_process'){
//       var body = '';
//       request.on('data', function(data){
//           body = body + data;
//       });
//       request.on('end', function(){
//           var post = qs.parse(body);
//           var id = post.id;
//           var filteredId = path.parse(id).base;
//           fs.unlink(`data/${filteredId}`, function(error){
//             response.writeHead(302, {Location: `/`});
//             response.end();
//           })
//       });
//     } else {
//       response.writeHead(404);
//       response.end('Not found');
//     }
// });
// app.listen(3000);
