var url = require('url');
var qs = require('querystring');
var db = require('./db.js');
var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');

exports.home = (request, response) => {
    db.query(`SELECT * FROM topic`, (err, topics) => {
        if(err){
          throw err;
        }
        var title = 'Welcome';
        var ol = template.list(topics);
        var description = 'Hello, Node.js';
        var html = template.html(title, ol, `<a href="/create">create</a>`, `<h2>${title}</h2><p>${description}</p>`);
        response.writeHead(200);
        response.end(html);
    })
}

exports.page = (request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic;`, (err, topics) => {
        if(err){
            throw err;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author on topic.author_id = author.id WHERE topic.id = ?;`, [queryData.id], (err2, topic) => {
            if(err2){
            throw err2;
            }else{
            var title = topic[0].title;
            var ol = template.list(topics);
            var description = topic[0].description;
            var html = template.html(title, ol, `
            <a href="/update?id=${queryData.id}">update</a> 
            <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
            </form>
                `, `<h2>${sanitizeHtml(title)}</h2><p>${sanitizeHtml(description)}</p><p>By ${sanitizeHtml(topic[0].name)}</p>`);
            response.writeHead(200);
            response.end(html);
            }
        })
    })
}

exports.create = (request, response) => {
    db.query(`SELECT * FROM topic;`, (err, topics) => {
        db.query(`SELECT * FROM author;`, (err2, authors) => {
            if(err2){
                throw err2;
            }else{
                if(err){
                    throw err;
                }
                var title = 'Create';
                var ol = template.list(topics);
                var select = template.author(authors);
                var html = template.html(title, ol, ``, `
                    <form action="create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p><textarea name="description" placeholder="description"></textarea></p>
                    <p>${select}</p>
                    <p><input type="submit"></p>
                    </form>
                `);
                response.writeHead(200);
                response.end(html);
            }
        })
    })
}

exports.createProcess = (request, response) => {
    var body = '';
        request.on('data', (data) => {
            body = body + data;
        })
        request.on('end', () => {
            var post = qs.parse(body);
            db.query(`INSERT INTO topic (title, description, created, author_id) VALUES (?, ?, NOW(), ?);`, [post.title, post.description, post.author], (err, result) => {
            if(err){
                throw err;
            }else{
                response.writeHead(302, {Location: `/?id=${result.insertId}`});
                response.end();
            }
        })
    })    
}

exports.update = (request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, (err, topics) => {
        if(err){
          throw err;
        }else{
            db.query(`SELECT * FROM topic WHERE id = ?`, [queryData.id], (err2, topic) => {
                if(err2){
                    throw err2;
                }else{
                    db.query(`SELECT * FROM author;`, (err3, authors) => {
                        if(err3){
                        throw err3
                        }else{
                        var title = 'Update';
                        var ol = template.list(topics);
                        var select = template.author(authors, topic[0].author_id);
                        var html = template.html(title, ol, ``, `
                            <form action="/update_process" method="post">
                                <input type="hidden" name="id" value="${topic[0].id}">
                                <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"></p>
                                <p><textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea></p>
                                <p>${select}</p>
                                <p><input type="submit"></p>
                            </form>
                        `);
                        response.writeHead(200);
                        response.end(html);
                        }
                    })
                }
            })
        }
    })
}

exports.updateProcess = (request, response) => {
    var body = '';
    request.on('data', (data) => {
        body = body + data;
    })
    request.on('end', () => {
        var post = qs.parse(body);
        var id = post.id
        var title = post.title;
        var description = post.description;
        var author = post.author;
        db.query(`UPDATE topic SET title = ?, description = ?, author_id = ? WHERE id = ?`, [title, description, author, id], (err, result) => {
            if(err){
                throw err;
            }else{
                response.writeHead(302, {Location: `/?id=${id}.html`});
                response.end();
            }
        })
    })
}

exports.deleteProcess = (request, response) => {
    var body = '';
    request.on('data', (data) => {
        body = body + data;
    })
    request.on('end', () => {
        var post = qs.parse(body);
        var id = post.id
        db.query(`DELETE FROM topic WHERE id = ?`, [id], (err, result) => {
            if(err){
                throw err;
            }else{
                response.writeHead(302, {Location: `/`});
                response.end();
            }
        })
    })
}