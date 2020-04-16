const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const db = require('../db.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/signUp.html'));
})

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

passport.serializeUser((user, done) => {
  return done(null, user.id);
})

passport.deserializeUser((id, done) => {
  db.query('SELECT * FROM characters WHERE id = ?', [id], (err, result) => {
    if(err) throw err;
    if(result[0]){
      return done(null, result[0]);
    }else{
      return;
    }
  })
})

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
            console.log(filteredUser)
            return res.json({result : 'Ok', data : filteredUser});
          })
        })
      })
    }
  })(req, res)
})
module.exports = router;