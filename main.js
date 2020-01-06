var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  
  if(pathname === '/'){
    if(queryData.id === undefined){
      fs.readdir('data', (err, filelist) => {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var ol = '<ol>';
        filelist.forEach(res => {
          var li = `<li><a href="/?id=${res}">${res.replace('.html', '')}</a></li>`
          ol = ol+li;
        })
        ol = ol+'</ol>';
        var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${ol}
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
        `;
        response.writeHead(200);
        response.end(template);
      })
    }else{
      fs.readdir('data', (err, filelist) => {
        var ol = '<ol>';
        filelist.forEach(res => {
          var li = `<li><a href="/?id=${res}">${res.replace('.html', '')}</a></li>`
          ol = ol+li;
        })
        ol = ol+'</ol>';
        fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
          var title = queryData.id.replace('.html', '');
          var template = `
            <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${ol}
              <h2>${title}</h2>
              <p>${description}</p>
            </body>
            </html>
          `;
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
