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

  // 1. 수정이든, 삭제든 해당 페이지로 이동하는것은, a 링크를 사용해도 되지만, 해당 기능이 실행되는 과정에서는 form의 post방식을 사용해야한다 꼭!
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
  }else if(pathname === '/author/create_process'){
    author.createProcess(request, response);
  }else if(pathname === '/author/update'){
    author.update(request,response);
  }else if(pathname === '/author/update_process'){
    author.updateProcess(request, response);
  }else if(pathname === '/author/delete_process'){
    author.deleteProcess(request, response);
  }else{
    response.writeHead(404);
    response.end('Not Found');
  }
});
app.listen(3000);