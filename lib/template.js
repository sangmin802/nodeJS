module.exports = {
  html : function(title, ol, body, control){
    return `
      <!doctype html>
      <html>
      <head>
        <style>
          * {color : black; text-decoration : none;}
        </style>
        <title>WEB - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        ${ol}
        ${control}
        ${body}
      </body>
      </html>
    `;
  },
  list : function(filelist){
    var ol = '<ol>';
    filelist.forEach(res => {
      var li = `<li><a href="/?id=${res}">${res.replace('.html', '')}</a></li>`
      ol = ol+li;
    })
    ol = ol+'</ol>';
    return ol;
  }
}
