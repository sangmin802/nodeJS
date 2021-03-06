const db = require('../db.js');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

module.exports = (router) => {
  // 회원가입 route
  passport.use('signUp', new LocalStrategy({
    usernameField : 'name',
    passwordField : 'name',
  }, (name, pw, done) => {
    db.query('SELECT * FROM characters WHERE name = ?', [name], (err, result) => {
      if(err) return done(err);
      if(result.length === 0){
        return done(null, true)
      }else{
        return done(null, false, {reason : 'Your name is already used!'})
      }
    });
  }));
  
  router.post('/new_info', (req, res) => {
    passport.authenticate('signUp', (err, user, info) => {
      if(err) throw err;
      if(user === false){
        return res.json({result : 'No', reason : info.reason});
      }else{
        const name = req.body.name;
        const desc = req.body.desc;
        db.query('INSERT INTO characters (name, age_id, kind_id, description, created) VALUES (?, ?, ?, ?, NOW())', [name, 2, 1, desc], (err2, added) => {
          if(err2) throw err2;
          db.query('SELECT characters.id, name, age, grade, kind, description, kindDescription FROM characters LEFT JOIN age ON characters.age_id = age.id LEFT JOIN kind on characters.kind_id = kind.id Where characters.id = ?', [added.insertId], (err3, data) => {
            if(err3) throw err3;
            return req.login(data[0], (loginErr) => {
              if(loginErr) throw err;    
              const filteredUser = {...data[0]};
              delete filteredUser.name;
              return res.json({result : 'Ok', data : filteredUser});
            })
          })
        })
      }
    })(req, res)
  })
  
  // 로그인 route
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
        return done(null, false, {reason : 'Uncertified User!'})
      }
    })
  }))

  router.post('/check_name', (req, res) => {
    passport.authenticate('signIn', {session : false}, (err, user, info) => {
      if(err) throw err;
      if(user === false){
        return res.json({result : 'No', reason : info.reason});
      }
      return req.login(user, {session : false}, (loginErr) => {
        if(loginErr) throw loginErr;
        const filteredUser = {...user};
        delete filteredUser.name;
        const token = jwt.sign({...user}, 'SangminToken');
        res.cookie('user', token);
        return res.json({result : 'Ok', data : filteredUser, token});
      })
    })(req, res)
  })

  // router.post('/check_name', (req, res) => {
  //   passport.authenticate('signIn', (err, user, info) => {
  //     if(err) throw err;
  //     if(user === false){
  //       return res.json({result : 'No', reason : info.reason});
  //     }
  //     // 1. id를 맞게 입력했다면, req.login의 첫번째 함수로 회원정보가담긴 객체user를 인자로 받는 serializeUser메소드가 실행되며, done을 통해 두번째 인자의 값을 서버에 저장한다.
  //     //    -> 본래, authenticate를 사용하면 req.login을 정의해주지 않아도 serializeUser가 자동실행되지만, 커스텀방식으로 하였기 때문에, 따로 입력해주어야한다.
  
  //     // 3. 콜백함수인 loginErr => {...}가 실행되며, 이 때 프론트단에서 필요한 정보를 넘겨준다. (혹시 닉네임같은게 필요할 수 있으니, 건내주고 localhost에 저장하든 뭘하든 알아서..)
  //     return req.login(user, (loginErr) => {
  //       if(loginErr) throw loginErr;
  //       const filteredUser = {...user};
  //       delete filteredUser.name;
  //       return res.json({result : 'Ok', data : filteredUser});
  //     })
  //   })(req, res)
  // })

  // // 재요청시 세션비교
  // passport.serializeUser((user, done) => {
  //   // 2. session dir와 브라우저의 쿠키에 키워드가 저장되고, 그 키워드를 통해 상태를 유지시킴
  //   return done(null, user.id)
  // })
  
  // // 4. 이후 새로고침 등 재요청이 있을 때마다 deserializeUser가 실행되어 serializeUser의 done에서 두번째 인자로 보낸 서버에 저장되어있는 값을 활용하여 알아서 결과물을 출력한다. 해당 결과물은 req.session에서 조회 가능하다.
  // passport.deserializeUser((id, done) => {
  //   db.query('SELECT * FROM characters WHERE id = ?', [id], (err, result) => {
  //     if(err) throw err;
  //     if(result[0]){
  //       return done(null, result[0]);
  //     }else{
  //       return;
  //     }
  //   })
  // });
}
