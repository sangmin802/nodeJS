const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const db = require('../db.js');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/signUp.html'));
})
router.post('/new_info', (req, res) => {
  const name = req.body.name;
  const desc = req.body.desc;
  db.query('INSERT INTO characters (name, age_id, kind_id, description, created) VALUES (?, ?, ?, ?, NOW())', [name, 2, 1, desc], (err, result) =>{
    if(err) throw err;
    db.query('SELECT characters.id, name, age, grade, kind, description, kindDescription FROM characters LEFT JOIN age ON characters.age_id = age.id LEFT JOIN kind on characters.kind_id = kind.id Where characters.id = ?', [result.insertId], (err2, data) => {
      if(err2) throw err2;
      if(data[0]){
        req.session.data = data[0];
        res.json({result : 'Ok', data : data[0]});
      }else{
        res.json({result : 'No'});
      }
    })
  })
})
module.exports = router;