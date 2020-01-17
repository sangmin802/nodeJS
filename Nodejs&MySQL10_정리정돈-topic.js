var http = require('http');
var url = require('url');
var topic = require('./lib/topic.js');

var app = http.createServer((request,response) => {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  // 1. main.js에 기능들을 추가하면서, 보기가 힘들어졌기때문에 기능별로 정리를 해주자.
  // 2. MySQL의 DB를 읽어오는 method는 lib의 db.js로 옮기고, 해당 파일을 모듈화하여 가져오자.(해당 모듈에서 connect()또한 실행되고 갖고오기때문에, 별도로 실행시킬 빌요는 없다.)
  // 3. 먼저 CRUD 관련 기능들은 lib의 topic.js에 모두 옮길것.
  // 4. topic.js에서 DB를 읽어오는 모듈이 필요하기 때문에, db.js모듈을 읽어오는 구문을 작성한다. 그리고, 해당 topic과 관련된 method를 사용할 수 있도록 exports 해준다.
  // 5. 기능별로 적절한 method명을 정해주고, module.exports가 아닌, 그냥 exports로 모든 method를 사용할 수 있도록 해준다.
  // 6. topic.js에서 필요한 모듈들을 require해준다.
  
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
  }else{
    response.writeHead(404);
    response.end('Not Found');
  }
});
app.listen(3000);