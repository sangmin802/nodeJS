var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var db = require('./lib/db.js');
var topic = require('./lib/topic.js');
var author = require('./lib/author.js');

var app = http.createServer((request,response) => {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  
  // 1. 일단 기본 html생성에서, /author로 가는 a링크를 만든다.
  // 2. 저자관련 method를 모아놓은 author.js를 lib 디렉토리 안에 넣는다.
  // 3. pathname이 /author이면 author모듈의 home method를 실행시킨다.
  // 4. 해당 method는, 일단 index화면처럼, topics를 불러서 구현시켜주고, body부분만 SELECT * FROM author쿼리문을 활용하여 table을 만들어준다.

  if(pathname === '/'){
    if(queryData.id === undefined){
      topic.home(request, response);
    }else{
      topic.page(request, response);
    }
  }else if(pathname === '/create'){
    topic.create(request, response);
  }else if(pathname === '/create_process'){
    topic.createProcess(request, response);
  }else if(pathname === '/update'){
    topic.update(request, response);
  }else if(pathname === '/update_process'){
    topic.updateProcess(request, response);
  }else if(pathname === '/delete_process'){
    topic.deleteProcess(request, response);
  }else if(pathname === '/author'){
    author.home(request, response);
  }else{
    response.writeHead(404);
    response.end('Not Found');
  }
});
app.listen(3000);