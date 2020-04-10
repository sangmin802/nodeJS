var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');
var db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'q684188e',
  database : 'opentutorials'
});
db.connect();

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if(pathname === '/'){
    if(queryData.id === undefined){
      db.query(`SELECT * FROM topic`, (err, topics) => {
        if(err){
          throw err;
        }
        var title = 'Welcome';
        var ol = template.list(topics);
        var description = 'Hello, Node.js';
        var html = template.html(title, ol, `<h2>${title}</h2><p>${description}</p>`, `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(html);
      })
    }else{
      db.query(`SELECT * FROM topic;`, (err, topics) => {
        if(err){
          throw err;
        }
        db.query(`SELECT * FROM topic WHERE id = ?;`, [queryData.id], (err2, topic) => {
          if(err2){
            throw err2;
          }
          var title = topic[0].title;
          var ol = template.list(topics);
          var description = topic[0].description;
          var html = template.html(title, ol, `<h2>${title}</h2><p>${description}</p>`, `
          <a href="/update?id=${queryData.id}.html">update</a> 
          <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${queryData.id}">
            <input type="submit" value="delete">
          </form>
        `);
          response.writeHead(200);
          response.end(html);
        })
      })
    }
  }else if(pathname === '/create'){
    // 1. 동일하게 create를 눌러도, 목록은 보이게 topic 테이블을 보여주는 쿼리를 작성한다.
    // 2. 다만 form태그의 내용이 들어가겠지?
    // 3. 기존과 동일하게, post방식으로 보낸 정보를 받아온 뒤, 받아온 정보를 토대로 sql문으로 INSERT 해준다.
    // 4. 단, 내용을 읽어올 때 id값은 ?로 보낸뒤 인자로 따로 보낸 것처럼, VALUES 들을 ?로 해주고, 두번째 인자로 실제 값들을 보내준다.
    // 5. 그리고, 생성한 페이지를 보여주고자 할 때에, id값은 autoincrement이므로 result.insertId라는 프로퍼티를 통해 가져올 수 있다.
    db.query(`SELECT * FROM topic;`, (err, topics) => {
      if(err){
        throw err;
      }
      var title = 'Create';
      var ol = template.list(topics);
      var html = template.html(title, ol, `
        <form action="create_process" method="post">
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
      db.query(`INSERT INTO topic (title, description, created, author_id) VALUES (?, ?, NOW(), ?);`, [post.title, post.description, 1], (err, result) => {
        if(err){
          throw err;
        }else{
          response.writeHead(302, {Location: `/?id=${result.insertId}`});
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