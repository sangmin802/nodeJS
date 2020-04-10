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
      fs.readdir('data', 'utf8', (err, filelist) => {
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
    request.on('data', (data) => {
      body = body + data;
    })
    request.on('end', () => {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      // 1. 데이터를 다 받아왔다면, 해당 파일을 작성한다. 첫번째 인자로 저장될 위치와 이름을 정해주고, 두번째 인자로 내용을 정해준다.
      // 2. 3번째인자로 읽을 방식을 정하고, 4번째로 콜백함수를 실행시켜서 파일이 작성되면 redirect기능으로 바로 작성된 파일의 주소로 사용자를 이동시킨다.
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