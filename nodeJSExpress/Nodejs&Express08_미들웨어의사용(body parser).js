const express = require('express');
const app = express();
const fs = require('fs');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const qs = require('querystring');
const bodyParser = require('body-parser');

// 미들웨어 : 간단히 알아본 결과, nodejs가 실행되면서 사용자가 req(요청)을 하고, 다음에 실행되는것 이후 res(응답)이 진행되는데, 해당 기능은 많이 사용되는 기능을 유능한 개발자가 만든 것이다.(npm같음)
app.use(bodyParser.urlencoded({extended : false}));
// 설치 : npm install body-parser
// 1. 위의 구문을 통해, nodejs가 실행되어 요청이되면, use내부의 인자가 보내지면서 만들어지는 미들웨어가 생성된다.
// 2. 일단 저 bodyParser.urlencoded({extended : false})로 생성되는 미들웨어는 post로 보내진 정보를 내부적으로 분석하여, 콜백함수를 실행시킨다.

// 결과 
// bodyparse라는 미들웨어를 활용하여 기존 app.post의 코드를 확 줄일 수 있다.
// 내부적으로 body라는 변수를 생성하고, qs.parse(body)의 과정을 내부적으로 진행해서 req.body의 값으로 돌려줌.

// 생각
// req -> 입력한 미들웨어 생성 -> res의 시간주기
// 시간주기라는것이 Angular의 것인줄 알았는데, nodejs의 기능이였음

app.get('/', (req, res) => { 
  fs.readdir('./data', (err, filelist) => {
    if(!err){
      const title = 'Welcome';
      const description = 'Hello, Node.js';
      const list = template.list(filelist);
      const html = template.HTML(title, list,
        `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a>`
      );
      res.send(html);
    };
  });
});

app.get('/page/:pageId', (req, res) => {
  fs.readdir('./data', (err, filelist) => {
    const filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`./data/${filteredId}`, 'utf8', (err2, description) => {
      if(!err && !err2){
        const sanitizedTitle = sanitizeHtml(filteredId);
        const sanitizedDescription = sanitizeHtml(description);
        const list = template.list(filelist);
        const html = template.HTML(sanitizedTitle, list,
          `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
          `
          <a href="/create">create</a>
          <a href="/update/${sanitizedTitle}">update</a>
          <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>
          `
        );
        res.send(html);
      };
    });
  });
});

app.get('/create', (req, res) => {
  fs.readdir('./data', (err, filelist) => {
    if(!err){
      const title = 'Create';
      const list  = template.list(filelist);
      const html = template.HTML(title, list, `
      <h2>${title}</h2>
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit" value="create">
        </p>
      </form>
      `, ``);
      res.send(html);
    };
  });
});

app.post('/create_process', (req, res) => {
  // let body = '';
  // req.on('data', (data) => {
  //     body = body + data;
  // });
  // req.on('end', () => {
  //   const post = qs.parse(body);
  //   fs.writeFile(`./data/${post.title}`, post.description, 'utf8', (err) => {
  //     if(!err){
  //       res.redirect(`/page/${post.title}`);
  //     };
  //   });
  // });

  const post = req.body;
  fs.writeFile(`./data/${post.title}`, post.description, 'utf8', (err) => {
    if(!err){
      res.redirect(`/page/${post.title}`);
    };
  });
});

app.get('/update/:pageId', (req, res) => {
  fs.readdir('./data', (err, filelist) => {
    const filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`./data/${filteredId}`, 'utf8', (err2, description) => {
      if(!err && !err2){
        const title = 'Update';
        const list = template.list(filelist);
        const html = template.HTML(title, list, `
        <h2>${title}</h2>
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${sanitizeHtml(filteredId)}">
          <p>
            <input type="text" name="title" value="${sanitizeHtml(filteredId)}">
          </p>
          <p>
            <textarea name="description">${sanitizeHtml(description)}</textarea>
          </p>
          <input type="submit" value="update">
        </form>
        `, ``);
        res.send(html);
      };
    });
  });
});

app.post('/update_process', (req, res) => {
  // let body = '';
  // req.on('data', (data) => {
  //   body = body + data;
  // });
  // req.on('end', () => {
  //   const post = qs.parse(body);
  //   fs.rename(`./data/${post.id}`, `./data/${post.title}`, (err) => {
  //     fs.writeFile(`./data/${post.title}`, post.description, 'utf8', (err2) => {
  //       if(!err && !err2){
  //         res.redirect(`/page/${post.title}`);
  //       };
  //     });
  //   });
  // });

  const post = req.body;
  fs.rename(`./data/${post.id}`, `./data/${post.title}`, (err) => {
    fs.writeFile(`./data/${post.title}`, post.description, 'utf8', (err2) => {
      if(!err && !err2){
        res.redirect(`/page/${post.title}`);
      };
    });
  })
});

app.post('/delete_process', (req, res) => {
  // let body = '';
  // req.on('data', (data) => {
  //   body = body + data;
  // });
  // req.on('end', () => {
  //   const post = qs.parse(body);
  //   fs.unlink(`./data/${post.id}`, (err) => {
  //     if(!err){
  //       res.redirect('/');
  //     };
  //   });
  // });

  const post = req.body;
  fs.unlink(`./data/${post.id}`, (err) => {
    if(!err){
      res.redirect('/');
    }
  })
});

app.listen(3000);