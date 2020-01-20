var sanitizeHtml = require('sanitize-html');

module.exports = {
  html : (title, ol, control, body) => {
    return `
      <!doctype html>
      <html>
      <head>
        <style>
          * {color : black; text-decoration : none;}
          .title{font-weight : bold; font-size : 18px; background : #efefef;}
          table {border-collapse : collapse;}
          tr, td {border : 1px solid black; padding : 5px 10px;}
        </style>
        <title>WEB - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <a href="/author">Author</a>
        ${ol}
        ${control}
        ${body}
      </body>
      </html>
    `;
  },
  list : (topics) => {
    var ol = '<ol>';
    topics.forEach(res => {
      var li = `<li><a href="/?id=${res.id}">${sanitizeHtml(res.title.replace('.html', ''))}</a></li>`
      ol = ol+li;
    })
    ol = ol+'</ol>';
    return ol;
  },
  author : (authors, author_id) => {
    var select = '<select name ="author">';
    authors.forEach(res => {
      var selected = '';
      if(res.id === author_id){
        selected = 'selected';
      }
      var option = `<option value="${res.id}" ${selected}>${sanitizeHtml(res.name)}</option>`
      select = select+option;
    })
    select = select + '</select>';
    return select;
  },
  authorTable : (authors) => {
    var table = `
    <h2>Author List</h2>
    <table>
      <tr class="title">
        <td>title</td>
        <td>profile</td>
        <td>update</td>
        <td>delete</td>
      </tr>`;
    authors.forEach(res => {
      var tr = `
        <tr>
          <td>${sanitizeHtml(res.name)}</td>
          <td>${sanitizeHtml(res.profile)}</td>
          <td><a href="/author/update?id=${res.id}">update</a></td>
          <td>
            <form action="/author/delete_process" method="post">
              <input type="hidden" name="id" value="${res.id}">
              <input type="submit" value="delete">
            </form>
          </td>
        </tr>
      `;
      table = table + tr;  
    })
    table = table + '</table>';
    return table;
  }
}
