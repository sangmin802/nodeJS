const express = require('express');
const app = express();
const fs = require('fs');
const template = require('./lib/template.js');
const url = require('url');
const path = require('path');
const sanitizeHtml = require('sanitize-html');

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

// 1. 기존에는, url모듈을 불러와서, req.url을 찾고, url.parse(_url, true).query를 통해 querystring을 찾아서 하였다.
// 문제. 하지만, 미관상 이쁘지 않고, 노출된다는 점에서 지양되고 있다.
// 2. 개선방법으로, 우리 Angular할 때, url로 params를 보내는 방식(/:)을 활용한다.
// 3. 이러한 경로로 보내기 위해 template의 a href주소도, /page/이름 으로 보내준다.
// 4. params의 특성상 같은 위치의 값을 보내주기 때문에 req.params.pageId를 통해 해당 값을 받아올 수 있다.

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
          ``
        );
        res.send(html);
      };
    });
  });
});

app.listen(3000, () => console.log(`Example app listening on port 3000!`));

// var http = require('http');
// var fs = require('fs');
// var url = require('url');
// var qs = require('querystring');
// var template = require('./lib/template.js');
// var path = require('path');
// var sanitizeHtml = require('sanitize-html');

// var app = http.createServer(function(request,response){
//     var _url = request.url;
//     var queryData = url.parse(_url, true).query;
//     var pathname = url.parse(_url, true).pathname;
//     if(pathname === '/'){
//       if(queryData.id === undefined){
//         fs.readdir('./data', function(error, filelist){
//           var title = 'Welcome';
//           var description = 'Hello, Node.js';
//           var list = template.list(filelist);
//           var html = template.HTML(title, list,
//             `<h2>${title}</h2>${description}`,
//             `<a href="/create">create</a>`
//           );
//           response.writeHead(200);
//           response.end(html);
//         });
//       } else {
//         fs.readdir('./data', function(error, filelist){
//           var filteredId = path.parse(queryData.id).base;
//           fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
//             var title = queryData.id;
//             var sanitizedTitle = sanitizeHtml(title);
//             var sanitizedDescription = sanitizeHtml(description, {
//               allowedTags:['h1']
//             });
//             var list = template.list(filelist);
//             var html = template.HTML(sanitizedTitle, list,
//               `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
//               ` <a href="/create">create</a>
//                 <a href="/update?id=${sanitizedTitle}">update</a>
//                 <form action="delete_process" method="post">
//                   <input type="hidden" name="id" value="${sanitizedTitle}">
//                   <input type="submit" value="delete">
//                 </form>`
//             );
//             response.writeHead(200);
//             response.end(html);
//           });
//         });
//       }
//     } else if(pathname === '/create'){
//       fs.readdir('./data', function(error, filelist){
//         var title = 'WEB - create';
//         var list = template.list(filelist);
//         var html = template.HTML(title, list, `
//           <form action="/create_process" method="post">
//             <p><input type="text" name="title" placeholder="title"></p>
//             <p>
//               <textarea name="description" placeholder="description"></textarea>
//             </p>
//             <p>
//               <input type="submit">
//             </p>
//           </form>
//         `, '');
//         response.writeHead(200);
//         response.end(html);
//       });
//     } else if(pathname === '/create_process'){
//       var body = '';
//       request.on('data', function(data){
//           body = body + data;
//       });
//       request.on('end', function(){
//           var post = qs.parse(body);
//           var title = post.title;
//           var description = post.description;
//           fs.writeFile(`data/${title}`, description, 'utf8', function(err){
//             response.writeHead(302, {Location: `/?id=${title}`});
//             response.end();
//           })
//       });
//     } else if(pathname === '/update'){
//       fs.readdir('./data', function(error, filelist){
//         var filteredId = path.parse(queryData.id).base;
//         fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
//           var title = queryData.id;
//           var list = template.list(filelist);
//           var html = template.HTML(title, list,
//             `
//             <form action="/update_process" method="post">
//               <input type="hidden" name="id" value="${title}">
//               <p><input type="text" name="title" placeholder="title" value="${title}"></p>
//               <p>
//                 <textarea name="description" placeholder="description">${description}</textarea>
//               </p>
//               <p>
//                 <input type="submit">
//               </p>
//             </form>
//             `,
//             `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
//           );
//           response.writeHead(200);
//           response.end(html);
//         });
//       });
//     } else if(pathname === '/update_process'){
//       var body = '';
//       request.on('data', function(data){
//           body = body + data;
//       });
//       request.on('end', function(){
//           var post = qs.parse(body);
//           var id = post.id;
//           var title = post.title;
//           var description = post.description;
//           fs.rename(`data/${id}`, `data/${title}`, function(error){
//             fs.writeFile(`data/${title}`, description, 'utf8', function(err){
//               response.writeHead(302, {Location: `/?id=${title}`});
//               response.end();
//             })
//           });
//       });
//     } else if(pathname === '/delete_process'){
//       var body = '';
//       request.on('data', function(data){
//           body = body + data;
//       });
//       request.on('end', function(){
//           var post = qs.parse(body);
//           var id = post.id;
//           var filteredId = path.parse(id).base;
//           fs.unlink(`data/${filteredId}`, function(error){
//             response.writeHead(302, {Location: `/`});
//             response.end();
//           })
//       });
//     } else {
//       response.writeHead(404);
//       response.end('Not found');
//     }
// });
// app.listen(3000);
