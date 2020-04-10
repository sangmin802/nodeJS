var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

// API = Application Programming Interface
// ex) fs.readFile
// 우리는 readFile이라는 메소드를 만들지 않았고, 어떻게작동하는지 모르지만 Nodejs개발자들이 해당 메소드를 만들고 제공하고있다.
// Nodejs메인사이트의 문서에서 사용할수 있는 API들을 볼 수 있다.

var app = http.createServer(function(request,response){
  // request : 받아오는 정보
  // response : 전달하고자하는 정보
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if(pathname === '/'){
    if(queryData.id === undefined){
      fs.readdir('data', 'utf8', (err, filelist) => {
        var title = 'Welcome';
        var ol = template.list(filelist);
        var description = 'Hello, Node.js';
        var html = template.html(title, ol, `<h2>${title}</h2><p>${description}</p>`, `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(html);
      })
    }else{
      fs.readdir('data', (err, filelist) => {
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
          var title = queryData.id.replace('.html', '');
          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description);
          var ol = template.list(filelist);
          var html = template.html(sanitizedTitle, ol, `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`, `
            <a href="/create">create</a> 
            <a href="/update?id=${sanitizedTitle}.html">update</a> 
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>
          `);
          response.writeHead(200);
          response.end(html);
        })
      })
    }
  }else if(pathname === '/create'){
    fs.readdir('data', (err, filelist) => {
      var title = 'WEB - create';
      var ol = template.list(filelist);
      var html = template.html(title, ol, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p><textarea name="description" placeholder="description"></textarea></p>
          <p><input type="submit"></p>
        </form>
      `, ``);
      response.writeHead(200);
      response.end(html);
    })
  }else if(pathname === '/create_process'){
    var body = '';
    request.on('data', (data) => {
      body = body + data;
    })
    request.on('end', () => {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}.html`, description, 'utf8', (err) => {
        if(err){
          response.writeHead(404);
          response.end('Not Found');
        }else{
          response.writeHead(302, {Location: `/?id=${title}.html`});
          response.end();
        }
      })
    })
  }else if(pathname === '/update'){
    fs.readdir('data', (err, filelist) => {
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
        var title = queryData.id.replace('.html', '');
        var ol = template.list(filelist);
        var html = template.html(title, ol, `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p><textarea name="description" placeholder="description">${description}</textarea></p>
          <p><input type="submit"></p>
        </form>
        `, ``);
        response.writeHead(200);
        response.end(html);
      })
    })
  }else if(pathname === '/update_process'){
    var body = '';
    request.on('data', (data) => {
      body = body + data;
    })
    request.on('end', () => {
      var post = qs.parse(body);
      var id = post.id
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}.html`, `data/${title}.html`, (err) => {
        fs.writeFile(`data/${title}.html`, description, 'utf8', (err) => {
          if(err){
            response.writeHead(404);
            response.end('Not Found');
          }else{
            response.writeHead(302, {Location: `/?id=${title}.html`});
            response.end();
          }
        }) 
      })
    })
  }else if(pathname === '/delete_process'){
    var body = '';
    request.on('data', (data) => {
      body = body + data;
    })
    request.on('end', () => {
      var post = qs.parse(body);
      var id = post.id
      fs.unlink(`data/${id}.html`, (err) => {
        if(err){
          response.writeHead(404);
          response.end('Not Found');          
        }else{
          response.writeHead(302, {Location: `/`});
          response.end();
        }
      })
    })
  }else{
    response.writeHead(404);
    response.end('Not Found');
  }
});
app.listen(3000);