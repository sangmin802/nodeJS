const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const db = require('../db.js');
const url = require('url');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.get('/', (req, res) => {
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
    return req.login(user, (loginErr) => {
      if(loginErr) throw loginErr;
      const filteredUser = {...user};
      delete filteredUser.name;
      return res.json({result : 'Ok', data : filteredUser});
    })
  })(req, res)
})

module.exports = router;