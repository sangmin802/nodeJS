var http = require('http');
var fs = require('fs');
var url = require('url');
var qs= require('querystring')

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if(pathname === '/'){
    if(queryData.id === undefined){
      fs.readdir('data', (err, filelist) => {
        var title = 'Welcome';
        var ol = templateList(filelist);
        var description = 'Hello, Node.js';
        var template = templateHtml(title, ol, `<h2>${title}</h2><p>${description}</p>`);
        response.writeHead(200);
        response.end(template);
      })
    }else{
      fs.readdir('data', (err, filelist) => {
        fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
          var title = queryData.id.replace('.html', '');
          var ol = templateList(filelist);
          var template = templateHtml(title, ol, `<h2>${title}</h2><p>${description}</p>`);
          response.writeHead(200);
          response.end(template);
        })
      })
    }
  }else if(pathname === '/create'){
    fs.readdir('data', (err, filelist) => {
      var title = 'WEB - create';
      var ol = templateList(filelist);
      var template = templateHtml(title, ol, `
        <form action="http://localhost:3000/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p><textarea name="description" placeholder="description"></textarea></p>
          <p><input type="submit"></p>
        </form>
      `);
      response.writeHead(200);
      response.end(template);
    })
  }else if(pathname === '/create_process'){
    var body = '';
    // 1. 한번에 많은 양의 데이터를 포스트방식으로 받아올 때에, 무리가되어 강제종료될 수 도 있기때문에, 조각조각 잘라서 받아올때마다 해당 'data' method를 실행시키게 하는 것.
    // 2. 실행되어 조각조각된 데이터를 받아올 때마다 비어있는 body에 누적시킴
    // 3. 데이터를 조각조각 보내다가, 더 이상 보낼 데이터가 없다면 해당 'end' method를 실행
    request.on('data', (data) => {
      body = body + data;
      // if(body.length > 1e6){ // 데이터가 너무 많으면 강제종료
      //   request.connection.destroy()
      // }
    })
    request.on('end', () => {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      console.log(title, description);
    })
    response.writeHead(200);
    response.end('success');
  }else{
    response.writeHead(404);
    response.end('Not Found');
  }
});
app.listen(3000);


function templateHtml(title, ol, body){
  return `
    <!doctype html>
    <html>
    <head>
      <style>
        * {color : black; text-decoration : none;}
      </style>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${ol}
      <a href="/create">create</a> 
      ${body}
    </body>
    </html>
  `;
}

function templateList(filelist){
  var ol = '<ol>';
  filelist.forEach(res => {
    var li = `<li><a href="/?id=${res}">${res.replace('.html', '')}</a></li>`
    ol = ol+li;
  })
  ol = ol+'</ol>';
  return ol;
}