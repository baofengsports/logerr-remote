var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

var basePath = __dirname + '/app';

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.set('view engine', 'ejs');
app.use(express.static(basePath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Controllers
var LogController = require("./app/engine/controllers/LogController.js");

app.get('/', function(req, res) {
  var loadPath = basePath + '/views/pages/index';
  LogController.getLogs(req, res, loadPath);
});

app.post('/log', function(req, res) {
  LogController.addLog(io, req, res);
});

app.post('/exception-data', function(req, res) {
  LogController.getExceptionData(req, res);
});

app.post('/log-read', function(req, res) {
  LogController.markExceptionAsRead(req, res);
});

http.listen(8901, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});