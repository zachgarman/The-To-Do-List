var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var todoRouter = require('./routes/todo');

// middleware running
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// routers running
app.use('/todo', todoRouter);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/views/index.html'));
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log('Listening on port ', server.address().port);
});
