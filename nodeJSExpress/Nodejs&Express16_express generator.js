// 1. express js공식 사이트에서 express generator를 통해 프로젝트를 할 때 마다 만들어야하는 기본구조를 만들어준다. 
// 1) npm install express-generator -g
// 2) express -h
// 3) express 프로젝트명
// 4) 해당 프로젝트에 들어가서, npm install (package.json에 있는 모듈들을 다운받아야 함)

// 2. 우리는 지금까지 pm2를 활용하여 실행시켰지만, 본래 express는 npm start 명령어를 활용해야 한다.
// 3. 이 기능으로 제공되는 구조가 가장 모범적인 구조이므로 되도록 시작은 이렇게 하자.
//  https://jinbroing.tistory.com/107 참고. 실행은 터미널로 해야할듯. 근데 이거 해봤는데, pm2도 안되고 여러모로 좀 개쓰레기같음.. 
// 해결 -> npm start 하지말고, pm2 start ../bin뭐시기(package의 strat 주소) --watch 하면 잘 된다. pm2 log도 가능