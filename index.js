var server = require('./server');
var router = require('./router');
var requestHandler = require('./requestHandler');

var handle = {};
handle["/"] = requestHandler.start;
handle["/public/js/jquery.js"] = requestHandler.jquery;
handle["/public/js/ticTacToe.js"] = requestHandler.ticTacToe;
handle["/public/css/bootstrap.css"] = requestHandler.bootstrap;
handle["/public/css/styles.css"] = requestHandler.styles;

server.start(router.route, handle);