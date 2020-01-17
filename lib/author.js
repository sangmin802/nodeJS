var db = require('./db.js');
var template = require('./template.js');

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
                    var control = `<a href="/create">create</a>`;
                    var html = template.html(title, ol, body, control)
                    response.writeHead(200);
                    response.end(html);
                }
            })
        }
    })
}