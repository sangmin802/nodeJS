var http = require('http');
var fs = require('fs');
var url = require('url');

// 1. 두개의 조건문에서 중복되는 부분(template, ol)을 함수로 지정한다음 return을 받는다.
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
  }else{
    response.writeHead(404);
    response.end('Not Found');
  }
});
app.listen(3000);


function templateHtml(title, ol, body){ // 중복되는부분
  return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${ol}
      ${body}
    </body>
    </html>
  `;
}

function templateList(filelist){ // 중복되는부분
  var ol = '<ol>';
  filelist.forEach(res => {
    var li = `<li><a href="/?id=${res}">${res.replace('.html', '')}</a></li>`
    ol = ol+li;
  })
  ol = ol+'</ol>';
  return ol;
}