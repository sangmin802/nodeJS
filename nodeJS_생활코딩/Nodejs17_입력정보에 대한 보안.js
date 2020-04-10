var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
// ?id=../userInform.js

// 상황 : DB를 통해 받아온 회원정보(id와 pw가 있음)를 유지시키고 있는 상태임.
// 1. Nodejs 특성상 url을 통해 정보를 읽고 해당 정보를 토대로 화면에 띄워줄때 읽어오는 부분을 ../(dir수정 즉 폴더위치 변경)을 통해 다른곳의 띄울 수 있다.
// 2. 그것을 막기 위해 url을 통해 정보를 받아오는 과정에서는 path가 제공하는 모듈을 사용하여 url에서 읽어오는 부분을 path.parse(queryData.id).base로 가공하여 dir부분을 모두 제거한 다음, 경로에다 입력해준다.
// 즉, 사용자가 dir을 조절 할 수 없도록 하는 것.
// 그냥 querystring의 값들은 다 dir을 제거해주는 작업을 해주면 될 듯

var app = http.createServer(function(request,response){
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
        // console.log(path.parse('../userInform.js'));
          // 0|main   | { root: '',
          // 0|main   |   dir: '..',
          // 0|main   |   base: 'userInform.js',
          // 0|main   |   ext: '.js',
          // 0|main   |   name: 'userInform' }
        // console.log(filteredId); // userInform.js
        // console.log(queryData.id) // ../userInform.js
        fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
        // fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
          var title = queryData.id.replace('.html', '');
          var ol = template.list(filelist);
          var html = template.html(title, ol, `<h2>${title}</h2><p>${description}</p>`, `
            <a href="/create">create</a> 
            <a href="/update?id=${title}.html">update</a> 
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}">
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