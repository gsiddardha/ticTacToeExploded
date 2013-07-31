var url = require('url');

exports.start = function (route, handle) {
	function onRequest(request, response) {
		var pathName = url.parse(request.url).pathname;
		console.log("Request path: "+pathName);
	
		route(handle, pathName, response);
	}
	var server = require('http').createServer(onRequest);
	server.listen(8888);
	
	var io = require('socket.io').listen(server);
	var ticTacToe = require('./game');
	var games = new Object();
	
	io.sockets.on('connection', function(socket) {
		socket.on('joinGame', function(data) {
			ticTacToe.joinExistingGame(games, socket);
		});
	
		socket.on('newGame', function(data) {
			ticTacToe.createNewGame(games, socket);
		});
	
		socket.on('move', function(data) {
			ticTacToe.newMove(games, socket, data);
		});
	})
}
