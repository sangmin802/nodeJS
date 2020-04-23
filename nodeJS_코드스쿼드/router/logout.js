const express = require('express');
const app = express();
const router = express.Router();

router.get('/', (req, res) => {
  // req.logout(); // passport에서 기본적으로 제공하는 기능.session제거
  res.clearCookie('user'); // jwt cookie에있는 token제거
  res.redirect('/');
})

module.exports = router;