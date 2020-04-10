var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  
  // 1. template생성 함수에, create라는 링크를 만들어준다.
  // 2. 해당 create으로 가는 링크는 href가 '/create' 이기 때문에, querystring과 / 사이값이 create로, pathname이 /가 아니라 /create이 된다.
  // 3. pathname이 /create인 경우, 일단 ol을 만들어야 하기 때문에 똑같이 readdir을 이용하고, templateHTML에서 body가 될 부분을 폼태그로 만들어준다.
  // 4. 실제로 완성된 폼태그에 값을 입력, submit하면 관리자창의 Network - All에서 보내진 값을 볼 수 있다.

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
        <form action="http://localhost:3000/process_create" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p><textarea name="description" placeholder="description"></textarea></p>
          <p><input type="submit"></p>
        </form>
      `);
      response.writeHead(200);
      response.end(template);
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