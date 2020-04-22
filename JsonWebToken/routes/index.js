const express = require('express');
const router = express.Router();

const JWT = require('jsonwebtoken');
const secretObj = require('../auth/jwt.js');
const db = require('../db.js');
db.connect();

router.get('/', (req, res) => {
  const token = req.cookies.user;
  let template = null;
  // JWT.verify(token, secretObj.secret, (err, decoded) => {
  //   if(err){
  //     template = `
  //     <form action="/login" method="POST">
  //       <div>
  //         <input name="name" type="text">
  //       </div>
  //       <input type="submit" value="Login">
  //     </form>
  //   `;
  //   }else{
  //     template = `
  //       <h1>Hello! ${decoded.name}</h1>
  //       <div>age : ${decoded.age}</div>
  //       <div>grade : ${decoded.grade}</div>
  //       <div>introduce : ${decoded.description}</div>
  //     `;
  //   }
  // });
  if(!token){
    template = `
      <form action="/login" method="POST">
        <div>
          <input name="name" type="text">
        </div>
        <input type="submit" value="Login">
      </form>
    `;
  }else{
    JWT.verify(token, secretObj.secret, (err, decoded) => {
      if(err){
        res.clearCookie('user')
        template = `
          <h3>Error by ${err}
          <button>Go Login</button>
          <script>
            document.querySelector('button').addEventListener('click', () => {
              location.pathname = '/';
            })
          </script>
        `;
      }else{
        template = `
          <h1>Hello! ${decoded.name}</h1>
          <div>age : ${decoded.age}</div>
          <div>grade : ${decoded.grade}</div>
          <div>introduce : ${decoded.description}</div>
        `;
      }
    });
  }
  res.send(template);
})

router.post('/login', (req, res) => {
  const name = req.body.name;
  db.query('SELECT characters.id, name, age, grade, kind, description, kindDescription FROM characters LEFT JOIN age ON characters.age_id = age.id LEFT JOIN kind on characters.kind_id = kind.id WHERE characters.name = ?', [name], (err, data) => {
    if(err) throw err;
    if(data.length !==0){
      const token = JWT.sign({...data[0]},secretObj.secret,
      {
        expiresIn : '1m'
      });
      res.cookie('user', token);
      res.send(`
        <h3>Hello! ${data[0].name}</h3>
        <button>Go Main</button>
        <script>
          document.querySelector('button').addEventListener('click', () => {
            location.pathname = '/';
          })
        </script>
      `)
    }else{
      res.send('No inform!')
    }
    // res.json({
    //   token : token
    // })
  })
})

router.get('/main', (req, res) => {

})

module.exports = router;