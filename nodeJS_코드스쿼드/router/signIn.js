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

router.post('/check_name', (req, res) => {
  passport.authenticate('signIn', (err, user, info) => {
    if(err) throw err;
    if(user === false){
      res.json({result : 'No', reason : info.reason});
    }else{
      req.session.data = user;
      res.json({result : 'Ok', data : user});
    }
  })(req, res)
})

module.exports = router;