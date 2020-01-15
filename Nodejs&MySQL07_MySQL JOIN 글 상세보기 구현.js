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
      // 1. topic에서 필요한 부분을 읽어올 때, JOIN문을 통해 연결시키고, id값이 중복되기 때문에 WHERE로 구분짓는 id는 topic.id라 명시시켜주자.
      db.query(`SELECT * FROM topic;`, (err, topics) => {
        if(err){
          throw err;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author on topic.author_id = author.id WHERE topic.id = ?;`, [queryData.id], (err2, topic) => {
          if(err2){
            throw err2;
          }else{
            var title = topic[0].title;
            var ol = template.list(topics);
            var description = topic[0].description;
            var html = template.html(title, ol, `<h2>${title}</h2><p>${description}</p><p>By ${topic[0].name}</p>`, `
            <a href="/update?id=${queryData.id}">update</a> 
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${queryData.id}">
              <input type="submit" value="delete">
            </form>
             `);
            response.writeHead(200);
            response.end(html);
          }
        })
      })
    }
  }else if(pathname === '/create'){
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
    db.query(`SELECT * FROM topic`, (err, topics) => {
      if(err){
        throw err;
      }else{
        db.query(`SELECT * FROM topic WHERE id = ?`, [queryData.id], (err2, topic) => {
          if(err2){
            throw err2;
          }else{
            var title = 'Update';
            var ol = template.list(topics);
            var html = template.html(title, ol, `
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${topic[0].id}">
                  <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                  <p><textarea name="description" placeholder="description">${topic[0].description}</textarea></p>
                  <p><input type="submit"></p>
                </form>
            `, ``);
            response.writeHead(200);
            response.end(html);
          }
        })
      }
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
      db.query(`UPDATE topic SET title = ?, description = ? WHERE id = ?`, [title, description, id], (err, result) => {
        if(err){
          throw err;
        }else{
          response.writeHead(302, {Location: `/?id=${id}.html`});
          response.end();
        }
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
      db.query(`DELETE FROM topic WHERE id = ?`, [id], (err, result) => {
        if(err){
          throw err;
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