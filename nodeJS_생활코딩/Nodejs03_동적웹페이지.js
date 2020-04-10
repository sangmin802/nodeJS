var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var title = queryData.id;

  if(_url == '/'){ // WEB을 누르면 querystring으로 /만 넘어감
    // _url = '/index.html';
    title = 'Welcome';
  }
  if(_url == '/favicon.ico'){
    return response.writeHead(404);
  }

  response.writeHead(200);
  // 1. 1,2,3 html을 따로 만드는것이 아닌, template을 통해 하나로 관리.
  // 2. title만 querystring의 id값을 변수로 하여 링크이동마다 변경.
  // 3. a태그의 주소를 모두 querystring 형식으로 하여 사용자가 클릭할때마다 조건에 맞는 형식으로 전달.
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
    <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">Hypertext Markup Language (HTML)</a> is the standard markup language for <strong>creating <u>web</u> pages</strong> and web applications.Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
    <img src="coding.jpg" width="100%">
    </p><p style="margin-top:45px;">HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.
    </p>
  </body>
  </html>
  `;
  response.end(template);
});
app.listen(3000);
