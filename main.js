var http = require('http');
var fs = require('fs');
var app = http.createServer(function(request,response){
    var url = request.url;
    if(request.url == '/'){
      url = '/index.html';
    }
    if(request.url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
    console.log(__dirname+url); // 터미널의 해당 파일의 주소 및 이름이 적힘
    response.end(fs.readFileSync(__dirname + url));
    // response.end('Legosi')
});
app.listen(3000);
// node main.js로 실행
// localhost 3000으로 가야함
// 근데 이거 ctrl+c로 중지하면 오류뜸. 서버로서의 역할을 하고 있음