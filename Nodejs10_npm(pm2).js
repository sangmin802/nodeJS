// pm2
// 설치 : npm install pm2 -g
// 실행 : pm2 start 파일명
// 종료 : pm2 list (파일 확인) -> pm2 stop 파일닉네임
// 상시감시 : pm2 start 파일명 --watch
// 오류감지 : 평소 node main.js를 해줄 때에는 오류가 바로바로 떴지만, 상시감지기능을 하면 못하기 때문에 pm2 log로 확인해야한다.
// 해당 nodejs파일을 감시하다가, 변경되면 자동으로 재실행 혹은 의도치않게 종료시 자동으로 실행 등등.. 편리한 기능 제공