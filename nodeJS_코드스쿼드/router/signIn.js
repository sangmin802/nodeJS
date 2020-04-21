const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('../auth/passport.js');

router.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, '..', 'build', 'signIn.html'));
  res.sendFile(path.join(__dirname, '../public/signIn.html'));
});

passport(router);

module.exports = router;