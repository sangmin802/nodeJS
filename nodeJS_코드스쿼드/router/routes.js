const express = require('express');
const router = express.Router();
const path = require('path');

const main = require('./main.js');
const signIn = require('./signIn.js')
const signUp = require('./signUp.js');

router.use('/', main);
router.use('/signIn', signIn);
router.use('/signUp', signUp);

module.exports = router;