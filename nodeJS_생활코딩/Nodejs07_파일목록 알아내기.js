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
        // console.log(filelist);
        // 1. 해당 폴더 내의 파일리스트를 배열형식으로 리턴한다.
        // 2. 배열의 값을 주소로 지정해준다.
        // 3. 근데 여기서는 document.method가 안돼더라.
        // 4. 이전에는 a의 주소가 "/?id=HTML" 이였기때문에, readfile할 때 뒤에 .html을 해줬어야 했는데, 지금은 파일리스트 자체를 불러올 때 .html도 배열에 같이 담기기 때문에, readfile할 때 .html을 빼줘야 한다. 더 좋아졌네
        // 아 근데 title을 수정해줘야햠 ㅎㅎ;
        // 5. 따라서 data폴더에 파일을 추가하면 바로 리스트에 자동으로 추가된다.
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
