const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const db = require('../db.js');
const url = require('url');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.get('/', (req, res) => {
  console.log(req.user)
  res.sendFile(path.join(__dirname, '../public/signIn.html'));
});

passport.use('signIn', new LocalStrategy({
  usernameField : 'name',
  passwordField : 'name',
  session : true,
}, (name, pw, done) => {
  db.query('SELECT * FROM characters WHERE name = ?', [name], (err, data) => {
    if(err) throw err;
    if(data.length !== 0){
      return done(null, data[0]);
    }else{
      return done(null, false, {reason : 'Uncertified Name!'})
    }
  })
}))

passport.serializeUser((user, done) => {
  return done(null, user.id)
})

// 3. 이후 새로고침 등 재요청이 있을 때마다 deserializeUser가 실행되어 serializeUser의 done에서 두번째 인자로 보낸 서버에 저장되어있는 값을 활용하여 알아서 결과물을 출력한다. 해당 결과물은 req.session에서 조회 가능하다.
passport.deserializeUser((id, done) => {
  db.query('SELECT * FROM characters WHERE id = ?', [id], (err, result) => {
    if(err) throw err;
    if(result[0]){
      return done(null, result[0]);
    }else{
      return;
    }
  })
});

router.post('/check_name', (req, res) => {
  passport.authenticate('signIn', (err, user, info) => {
    if(err) throw err;
    if(user === false){
      return res.json({result : 'No', reason : info.reason});
    }
    // 1. id를 맞게 입력했다면, req.login의 첫번째 함수로 회원정보가담긴 객체user를 인자로 받는 serializeUser메소드가 실행되며, done을 통해 두번째 인자의 값을 서버에 저장한다.
    //    -> 본래, authenticate를 사용하면 req.login을 정의해주지 않아도 serializeUser가 자동실행되지만, 커스텀방식으로 하였기 때문에, 따로 입력해주어야한다.

    // 2. 콜백함수인 loginErr => {...}가 실행되며, 이 때 프론트단에서 필요한 정보를 넘겨준다. (혹시 닉네임같은게 필요할 수 있으니, 건내주고 localhost에 저장하든 뭘하든 알아서..)
    return req.login(user, (loginErr) => {
      if(loginErr) throw loginErr;
      const filteredUser = {...user};
      delete filteredUser.name;
      return res.json({result : 'Ok', data : filteredUser});
    })
  })(req, res)
})

module.exports = router;