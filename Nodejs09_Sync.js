// 동기와 비동기
// 동기 : 일이 한방향으로 진행되는것.(시간사용에있어 비효율적.)
// 비동기 : 한방향이 아닌 동시에 여러일을 진행하는것.(시간사용에있어 매우 효율적 하지만 매우복잡하다.)

// Nodejs는 비동기에 적합한 프로그램이다.
var fs = require('fs');

// readFileSync 동기 (입력순서에 영향을 받음)
// console.log('A');
// var result = fs.readFileSync('SyncSample.txt', 'utf8');
// console.log(result);
// console.log('C')

// readFile 비동기 (입력순서에 영향을 받지 않음)
console.log('A');
fs.readFile('SyncSample.txt', 'utf8', (err, result) => {
    console.log(result);
});
console.log('C')

// Nodejs는 비동기에 적합한 프로그램이기 때문에 되도록 비동기적 방식을 사용하자.
// 다만, 단순한 프로그램이라면 동기적 방식을 사용해도 괜찮다.