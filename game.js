/*
	Cell
	0, 1, 2

	Single Box
	0	1	2
	3	4	5
	6	7	8
*/

newBoard = function(gameId, socket) {
	this.gameId = gameId;

	this.state = new Array(9);
	for(var i=0; i<9; i++)
		this.state[i] = new Array(0,0,0,0,0,0,0,0,0);
	
	this.player1 = socket;
	this.player2 = null;
	this.turn = 1;
	
	this.lastBox = -1;
	
	console.log('NEW GAME:: gameId:'+this.gameId+' player1:'+this.player1);
	return this
}

exports.createNewGame = function(games, socket) {
	var newGameId = 'game'+(new Date()).getUTCMilliseconds();
	games[newGameId] = new newBoard(newGameId, socket);
	
	socket.emit('gameCreated', {gameId: games[newGameId].gameId});
}

exports.joinExistingGame = function(games, socket) {
	for(var game in games) {
		if(games[game].player2 === null) {
			if(games[game].player1 == socket) {
				console.log("PLAYER ALREADY EXISTS");
				socket.emit('noFreeGames');
			}
			games[game].player2 = socket;
			
			games[game].player1.emit('gameStart', {gameId: games[game].gameId, turn: games[game].turn})
			games[game].player2.emit('gameStart', {gameId: games[game].gameId, turn: games[game].turn})
			
			console.log("JOINED GAME:: gameId:"+games[game].gameId+" player2:"+games[game].player2);
			return;
		}
	}
	
	console.log("NO FREE GAMES FOUND");
	socket.emit('noFreeGames');
}

isFull = function(state) {
	for(var i=0; i<state.length; i++) {
		for(var j=0; j<state[i].length; j++) {
			if(state[i][j] == 0)
				return false;
		}
	}
	
	console.log("BOARD FULL");
	return true;
}

isSingleWon = function(state) {
	// Across
	if( (state[0]==state[1] && state[1]==state[2]) && state[0]!=0 ) {
		console.log("GAME WON:: player:"+state[0]+" line:ACROSS1");
		return state[0];
	}
	if( (state[3]==state[4] && state[4]==state[5]) && state[3]!=0 ) {
		console.log("GAME WON:: player:"+state[3]+" line:ACROSS2");
		return state[3];
	}
	if( (state[6]==state[7] && state[7]==state[8]) && state[6]!=0 ) {
		console.log("GAME WON:: player:"+state[6]+" line:ACROSS3");
		return state[6];
	}
		
	// Down
	if( (state[0]==state[3] && state[3]==state[6]) && state[0]!=0 ) {
		console.log("GAME WON:: player:"+state[0]+" line:DOWN1");
		return state[0];
	}
	if( (state[1]==state[4] && state[4]==state[7]) && state[1]!=0 ) {
		console.log("GAME WON:: player:"+state[1]+" line:DOWN2");
		return state[1];
	}
	if( (state[2]==state[5] && state[5]==state[8]) && state[2]!=0 ) {
		console.log("GAME WON:: player:"+state[2]+" line:DOWN3");
		return state[2];
	}
		
	// Diagonal
	if( (state[0]==state[4] && state[4]==state[8]) && state[0]!=0 ) {
		console.log("GAME WON:: player:"+state[0]+" line:DIAGONAL1");
		return state[0];
	}
	if( (state[2]==state[4] && state[4]==state[6]) && state[2]!=0 ) {
		console.log("GAME WON:: player:"+state[2]+" line:DIAGONAL2");
		return state[2];
	}
		
	return 0;
}

isFullWon = function(state) {
	for(var i = 0; i<state.length; i++) {
		var tempWon = isSingleWon(state[i]);
		if(tempWon) {
			return tempWon;
		}
	}
	
	return 0;
}

printBoard = function(state) {
	console.log("CURRENT STATE::");
	console.log(state[0][0]+' '+state[0][1]+' '+state[0][2]+'|'+state[1][0]+' '+state[1][1]+' '+state[1][2]+'|'+state[2][0]+' '+state[2][1]+' '+state[2][2]);
	console.log(state[0][3]+' '+state[0][4]+' '+state[0][5]+'|'+state[1][3]+' '+state[1][4]+' '+state[1][5]+'|'+state[2][3]+' '+state[2][4]+' '+state[2][5]);
	console.log(state[0][6]+' '+state[0][7]+' '+state[0][8]+'|'+state[1][6]+' '+state[1][7]+' '+state[1][8]+'|'+state[2][6]+' '+state[2][7]+' '+state[2][8]);
	console.log('-----------------');
	console.log(state[3][0]+' '+state[3][1]+' '+state[3][2]+'|'+state[4][0]+' '+state[4][1]+' '+state[4][2]+'|'+state[5][0]+' '+state[5][1]+' '+state[5][2]);
	console.log(state[3][3]+' '+state[3][4]+' '+state[3][5]+'|'+state[4][3]+' '+state[4][4]+' '+state[4][5]+'|'+state[5][3]+' '+state[5][4]+' '+state[5][5]);
	console.log(state[3][6]+' '+state[3][7]+' '+state[3][8]+'|'+state[4][6]+' '+state[4][7]+' '+state[4][8]+'|'+state[5][6]+' '+state[5][7]+' '+state[5][8]);
	console.log('-----------------');
	console.log(state[6][0]+' '+state[6][1]+' '+state[6][2]+'|'+state[7][0]+' '+state[7][1]+' '+state[7][2]+'|'+state[8][0]+' '+state[8][1]+' '+state[8][2]);
	console.log(state[6][3]+' '+state[6][4]+' '+state[6][5]+'|'+state[7][3]+' '+state[7][4]+' '+state[7][5]+'|'+state[8][3]+' '+state[8][4]+' '+state[8][5]);
	console.log(state[6][6]+' '+state[6][7]+' '+state[6][8]+'|'+state[7][6]+' '+state[7][7]+' '+state[7][8]+'|'+state[8][6]+' '+state[8][7]+' '+state[8][8]);
}

makeMove = function(game, socket, data) {
	var curPlayerId;
	if(game.player1 == socket)
		curPlayerId = 1;
	else if(game.player2 == socket)
		curPlayerId = 2;
	else {
		console.log("INVALID PLAYER")
		socket.emit('error', {description: "Sorry mate! Wrong board."});
	}
	
	if(game.turn != data.playerId) {
		if(curPlayerId == 1)
			game.player1.emit('error', {description: "It's not your move!"});
		else
			game.player2.emit('error', {description: "Its' not your move!"});
		console.log("INVALID MOVE")
		return false;
	}
	
	var boxPosition = parseFloat(data.position.substr(0,1));
	var innerPosition = parseFloat(data.position.substr(1,1));
	if(game.state[boxPosition][innerPosition]!=0 || boxPosition < 0 || boxPosition > 8 || innerPosition < 0 || innerPosition > 8 || (game.lastBox != -1 && boxPosition != game.lastBox)) {
		socket.emit('error', {description: "Invalid position selected!"});
		console.log("INVALID POSITION")
		return false;
	}
		
	game.state[boxPosition][innerPosition] = curPlayerId;
	if(game.turn == 1)
		game.turn = 2;
	else
		game.turn = 1;
	game.lastBox = innerPosition;
	
	data.position = boxPosition+''+innerPosition;
	data.turn = game.turn;
	game.player1.emit('move', data);
	game.player2.emit('move', data);
	
	var winner = isFullWon(game.state);
	if(winner || isFull(game.state)) {
		game.player1.emit('gameOver', {winner: winner});
		game.player2.emit('gameOver', {winner: winner});
		
		console.log("GAME OVER:: winner:"+winner);
		return true;
	}
	
	printBoard(game.state);
	return false;
}

exports.newMove = function(games, socket, data) {
	var curGame = games[data.gameId];
	
	if(curGame === undefined) {
		console.log("INVALID GAME");
		socket.emit('error', {description: "Game does not exist!"});
		return;
	}
	
	var gameDone = makeMove(curGame, socket, data);
	if(gameDone) {
		console.log("GAME DELETED:: gameId:"+data.gameId);
		delete games[data.gameId];
	}
}