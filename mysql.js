var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root', // 실제 사용되고있는 user(기본값이 root였음)
  password : 'q684188e', // 실제 설정한 pw
  database : 'opentutorials' // 사용할 database
});

// 처음에 Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client 오류가 떴었음.
// 해결 : mysql installer > server 옆에 reconfigure > Auth 설정가서 legacy 선택 > 완료
connection.connect();
 
connection.query('SELECT * FROM topic', function (error, results, fields) {
  if (error) {
      console.log(error);
  };
  // console.log(results);
});
 
connection.end();