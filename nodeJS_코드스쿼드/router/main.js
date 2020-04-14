const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  let name = null;
  if(req.session.data){
    name = req.session.data.name;
  }
  res.render('main', {name : name})
  req.session.destroy();
});

module.exports = router;