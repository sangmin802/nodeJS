var http = require('http');
var fs = require('fs'); // file system의 약자
var url = require('url');

// CRUD = Create Read Update Delete
// 정보를 다루는 중요한 4가지
var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var title = queryData.id;

  if(_url == '/'){
    title = 'Welcome';
  }
  if(_url == '/favicon.ico'){
    return response.writeHead(404);
  }

  response.writeHead(200);
  fs.readFile(`data/${queryData.id}.html`, 'utf8', (err, description) => {
    // 1. fileSystem의 기본제공 method로 첫번째 인자 주소의 파일을 읽으라는 명령
    // 2. 두번째 인자인 utf8은 나중에 console로 찍어보았을 때, 문자열로 보이게하기위해서.
    // 3. description이 해당 파일의 내용이다.
    var template = `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ol>
        <li><a href="/?id=HTML">HTML</a></li>
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
      </ol>
      <h2>${title}</h2>
      <p>${description}</p>
    </body>
    </html>
    `;
    response.end(template);
  })
});
app.listen(3000);
