const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const topicRouter = require('./routes/topic.js');
const indexRouter = require('./routes/index.js');
const helmet = require('helmet');

app.use(helmet());
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(compression());
app.get('*', (req, res, next) => {
  fs.readdir('./data', (err, filelist) => {
    req.list = filelist;
    next();
  });
});

// routing page 이동
app.use('/', indexRouter);
app.use('/topic', topicRouter);

// error
// cant find routing path
app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});
// if(err) return
app.use((err, req, res, next) => {
  res.status(500).send('Something broke!');
});

// 실행
app.listen(3000);