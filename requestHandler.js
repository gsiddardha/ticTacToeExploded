var fs = require('fs');

exports.start = function (response) {
	fs.readFile(__dirname + '/ticTacToe.html', function(err, data) {
		if(err) {
			response.writeHead(500, {"Content-Type":"text/plain"});
			response.write("There seems to be some error. We'll get back soon.");
			reponse.end();
			return;
		}
	
		response.writeHead(200, {"Content-Type":"text/html"});
		response.write(data);
		response.end();
	});
}

exports.jquery = function(response) {
	fs.readFile(__dirname + '/public/js/jquery.js', function(err, data) {
		if(err) {
			response.writeHead(500, {"Content-Type":"text/plain"});
			response.write("There seems to be some error. We'll get back soon.");
			reponse.end();
			return;
		}
		
		response.writeHead(200, {"Content-Type":"text/javascript"});
		response.write(data);
		response.end();
	});
}

exports.ticTacToe = function(response) {
	fs.readFile(__dirname + '/public/js/ticTacToe.js', function(err, data) {
		if(err) {
			response.writeHead(500, {"Content-Type":"text/plain"});
			response.write("There seems to be some error. We'll get back soon.");
			reponse.end();
			return;
		}
		
		response.writeHead(200, {"Content-Type":"text/javascript"});
		response.write(data);
		response.end();
	});
}

exports.bootstrap = function(response) {
	fs.readFile(__dirname + '/public/css/bootstrap.css', function(err, data) {
		if(err) {
			response.writeHead(500, {"Content-Type":"text/plain"});
			response.write("There seems to be some error. We'll get back soon.");
			reponse.end();
			return;
		}
		
		response.writeHead(200, {"Content-Type":"text/css"});
		response.write(data);
		response.end();
	});
}

exports.styles = function(response) {
	fs.readFile(__dirname + '/public/css/styles.css', function(err, data) {
		if(err) {
			response.writeHead(500, {"Content-Type":"text/plain"});
			response.write("There seems to be some error. We'll get back soon.");
			reponse.end();
			return;
		}
		
		response.writeHead(200, {"Content-Type":"text/css"});
		response.write(data);
		response.end();
	});
}