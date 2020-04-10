var db = require('./db.js');
var template = require('./template.js');
var qs = require('querystring');
var url = require('url');
var sanitizeHtml = require('sanitize-html');

exports.home = (request, response) => {
    db.query(`SELECT * FROM topic`, (err, topics) => {
        if(err){
            throw err;
        }else{
            db.query(`SELECT * FROM author`, (err2, authors) => {
                if(err2){
                    throw err2;
                }else{
                    var title = 'Author List';
                    var ol = template.list(topics);
                    var body = template.authorTable(authors);
                    var control = `
                        <form action="/author/create_process" method="post">
                            <p>
                                <input type="text" name="name" placeholder="name">
                            </p>
                            <p>
                                <textarea name="profile" placeholder="profile"></textarea>
                            </p>
                            <p>
                                <input type="submit" value="create">
                            </p>
                        </form>
                    `;
                    var html = template.html(title, ol, body, control)
                    response.writeHead(200);
                    response.end(html);
                }
            })
        }
    })
}

exports.createProcess = (request, response) => {
    var body = '';
    request.on('data', (data) => {
        body = body + data;
    });
    request.on('end', () => {
        var post = qs.parse(body);
        db.query(`INSERT INTO author (name, profile) values (?, ?)`, [post.name, post.profile], (err) => {
            if(err){
                throw err;
            }else{
                response.writeHead(302, {Location : `/author`})
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
          console.log('?')
            throw err;
        }else{
            db.query(`SELECT * FROM author`, (err2, authors) => {
                if(err2){
                    throw err2;
                }else{
                    db.query(`SELECT * FROM author WHERE id = ?`, [queryData.id], (err3, author) => {
                        if(err3){
                            throw err3;
                        }else{
                            var title = 'Author Update';
                            var ol = template.list(topics);
                            var body = template.authorTable(authors);
                            var control = `
                                <form action="/author/update_process" method="post">
                                    <p>
                                        <input type="hidden" name="id" value="${author[0].id}">
                                        <input type="text" name="name" placeholder="name" value="${sanitizeHtml(author[0].name)}">
                                    </p>
                                    <p>
                                        <textarea name="profile" placeholder="profile">${sanitizeHtml(author[0].profile)}</textarea>
                                    </p>
                                    <p>
                                        <input type="submit" value="update">
                                    </p>
                                </form>
                            `;
                            var html = template.html(title, ol, body, control)
                            response.writeHead(200);
                            response.end(html);
                        }
                    })
                }
            })
        }
    })
};

exports.updateProcess = (request, response) => {
    var body = '';
    request.on('data', (data) => {
        body = body + data;
    });
    request.on('end', () => {
        var post = qs.parse(body);
        db.query(`UPDATE author SET name = ?, profile = ? WHERE id = ?`, [post.name, post.profile, post.id], (err) => {
            if(err){
                throw err;
            }else{
                response.writeHead(302, {Location : `/author`});
                response.end();
            }
        })
    })
};

exports.deleteProcess = (request, response) => {
    var body = '';
    request.on('data', (data) => {
        body = body + data;
    });
    request.on('end', () => {
        var post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE author_id = ?`, [post.id], (err) => {
            if(err){
                throw err;
            }else{
                db.query(`DELETE FROM author WHERE id = ?`, [post.id], (err2) => {
                    if(err2){
                        throw err2;
                    }else{
                        response.writeHead(302, {Location : `/author`});
                        response.end();
                    }
                });
            };
        });
    });
};
