var http = require('http');
var fs = require('fs');
var url = require('url');
var qs= require('querystring')

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  // 1. 기존 templateHTML에서 index화면이나 create에서는 update기능이 있을 필요가 없기 때문에, 변수처리를 해주어 필요한 값만 등록하게한다.
  // 2. data파일을 눌렀을 때, update버튼이 있어야 하고, 어떤것을 눌렀는지 알 수 있도록, 변수의 a태그 href에 /update?id=타이틀 을 해준다.
  // 3. /update라는 위치로 갔을 때의 조건문을 걸고, 파일리스트는 보여야하기때문에 readdir을 실행, 또한 파일을 읽어야 하므로 readFile을 실행시켜주고 그 안에서 templateHTML의 인자로 폼태그를 띄워준다.
  // 4. 보내지는 폼태그에서는, form action속성에 /update_process로 보내게 하고, 변경될 파일의 타이틀을 input hidden 의 value값으로 넣어준다 (name은 id로 하여 보내준다.).
  // 5. 수정기능이기 때문에, 기존에 작성되어있던 내용도 나와야 하므로, title의 value는 title, textarea의 태그 안에 description을 넣어준다.
  // 6. submit을 눌러 /update_process로 이동했을때의 조건을 걸어주고, post데이터를 받는 방식 request.on('body'), request.on('end')를 실행시킨다.
  // 7. 'end'를 실행시켰을 때, 제작할 때에는 title과 description만 있으면 되었지만, 수정될 때에는 기존의 파일도 알아야하기 때문에, id값도 선언해준다.
  // 8. fs.rename method를 활용하여 첫번째 인자로 기존의 위치및 이름, 두번째 인자로 기존의 위치및 바뀌게될 이름, 콜백함수를 적어준다.
  // 9. 해당 콜백함수에서는 제작할 때 처럼 fs.writeFile을 해주어 post로 받아온 수정될 description도 적용시켜준다음, redirect로 해당 페이지를 바로 보여준다.

  // 번외. create_process나 update_process에서는 template을 해주지 않아도 되는 이유가, redirect Location으로 querystring 페이지로 이동하게 해주었는데, 이 querystring 페이지는 조건문에서 template을 생성하기 때문이다.

  if(pathname === '/'){
    if(queryData.id === undefined){
      fs.readdir('data', 'utf8', (err, filelist) => {
        var title = 'Welcome';
        var ol = templateList(filelist);
        var description = 'Hello, Node.js';
        var template = templateHtml(title, ol, `<h2>${title}</h2><p>${description}</p>`, `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(template);
      })
    }else{
      fs.readdir('data', (err, filelist) => {
        fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
          var title = queryData.id.replace('.html', '');
          var ol = templateList(filelist);
          var template = templateHtml(title, ol, `<h2>${title}</h2><p>${description}</p>`, `<a href="/create">create</a> <a href="/update?id=${title}.html">update</a>`);
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
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p><textarea name="description" placeholder="description"></textarea></p>
          <p><input type="submit"></p>
        </form>
      `, ``);
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
  }else if(pathname === '/update'){
    fs.readdir('data', (err, filelist) => {
      fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
        var title = queryData.id.replace('.html', '');
        var ol = templateList(filelist);
        var template = templateHtml(title, ol, `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p><textarea name="description" placeholder="description">${description}</textarea></p>
          <p><input type="submit"></p>
        </form>
        `, ``);
        response.writeHead(200);
        response.end(template);
      })
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
      fs.rename(`data/${id}.html`, `data/${title}.html`, (err) => {
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
    })
  }else{
    response.writeHead(404);
    response.end('Not Found');
  }
});
app.listen(3000);


function templateHtml(title, ol, body, control){
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
      ${control}
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