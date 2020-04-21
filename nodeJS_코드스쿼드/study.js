// app method 내 느낌대로
// 1. use : 기본값으로 설정할 내용
// 2. get : 특정 url에 따른 응답값
// 3. post : form post로 보내진 값 수령
// 4. set : 첫번째에 사용할 기능을 선언, 그 값을 두번째에

// bodyparser모듈을 통해 post로 받아온 값을 req.body를 통해 바로 조회 가능하다.

// Node.js를 통해 회원인증 시스템을 구현할 때 두가지 방법이 있다.
//    npm install passport passport-local connect-flash --save -dev
//    1) passport : express에서 추천하는 인증 절차를 로직을 편하게 작업할 수 있게 도와주는 Node.js 미들웨어이다
//    2) passort-local : 페이스북같은 소셜로그인을 제외한 일반적인 로그인처리(local db에 저장)
//    3) connect-flash : 에러메시지를 좀 더 간단하게

// 1. Session기반.
//    npm install express-session --save -dev
//    passport & session 
//    로그인 이후, 서버에서 특정 값을 기억하고있어서 재요청시 그 값을 토대로 진행을 한다.
//    다른 주소의 서버를 사용하게 될 경우, 의미가 없어지고, 서버에 과부화가 심하다.

// 2. JWT(Json Web Token) 토큰기반.
// https://medium.com/front-end-weekly/learn-using-jwt-with-passport-authentication-9761539c4314

// session과 jwt의 차이 : https://velopert.com/2350

// 본래 강의에서는 flash기능을 사용해 로그인 실패 성공등을 알렸지만, 나는 res.json으로 값을 다시 보내주고싶어서, 커스텀방식으로 함.
