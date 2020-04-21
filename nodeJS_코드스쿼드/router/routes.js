const express = require('express');
const router = express.Router();

const main = require('./main.js');
const signIn = require('./signIn.js')
const signUp = require('./signUp.js');
const logOut = require('./logout.js');


router.use('/', main);
router.use('/signIn', signIn);
router.use('/signUp', signUp);
router.use('/logOut', logOut);

module.exports = router;