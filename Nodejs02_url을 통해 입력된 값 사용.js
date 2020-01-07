// 해당 모듈을 사용하겠다는 요구.
var http = require('http');
var fs = require('fs');
var url = require('url'); // url이라는 모듈을 사용할 것이다.
// 모듈 : 기본적으로 제공하는 기능들을 모아놓은 것

// 이거 근데 초기에는 링크이동이 모두 a의 1.html이런식이라서 querystring이 없기 때문에, undefined나 객체가 비이었게 나온다.
// 따라서 윈도우 창의 주소에 직접 querystringd을 입력해주고 새로고침해야 console이 제대로 찍힌다.
// 다음 강의에서부터 a의 링크를 모두 querystring으로 변경하니 걱정 ㄴㄴ
var app = http.createServer(function(request,response){
    var _url = request.url;
    // console.log(_url); // /?id=HTML <- 초기에는 윈도우창에 직접 입력을 해주어야함 위의 이유로 도메인이름, 포스트 이후의 값
    var queryData = url.parse(_url, true).query; // 주소에서 querystring을 가져오는 방법(객체형식)
    // console.log(queryData); // { id : 'HTML' }
    
    if(_url == '/'){
      _url = '/index.html';
    }
    if(_url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
    response.end(queryData.id); // 해당 경로에 있는 출력할 파일
 
});
app.listen(3000);
// node main.js로 실행
// main.js가 수정될때마다 종료했다 다시해야함
// localhost 3000으로 가야함
// 근데 이거 ctrl+c로 중지하면 오류뜸. 서버로서의 역할을 하고 있음