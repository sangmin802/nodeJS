var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  // pathname =  querystring의 시작인 ?와 / 사이의 값
  // 1. pathname === '/' 라는 조건은 querystring 이전과 / 사이의 값이 없는 정상적인 루트의 주소라는 상태이며
  // 2. Not found가 출력되는 주소의 조건은, 사용자가 임의로 입력해서 quertstring과 / 사이에 값이 있는 상태이다.

  // 실제로 정상적인 루트인 quertstring 형식
  // ex) /?id=legosi
  // 이라면, Not found가 안뜨고 정상적으로 작동되는것 처럼 보인다.
  var pathname = url.parse(_url, true).pathname;
  var title = queryData.id;
  // console.log(pathname)
  if(pathname === '/'){ // querystring 바로 이전의 값이 없는상태(정상적인 a태그의 루트)
    fs.readFile(`data/${queryData.id}.html`, 'utf8', (err, description) => {
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
      response.writeHead(200); // 200이라는 숫자를 주면 성공적인 주소라는 뜻
      response.end(template);
    })
  }else{
    response.writeHead(404); // 404라는 숫자를 주면 없거나 잘못된 주소라는 뜻
    response.end('Not Found');
  }
});
app.listen(3000);
