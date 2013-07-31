$(document).ready(function() {
	var gameId;
	var playerId = 2; // Always start with 2. When new game is created, it becomes 1
	var socket = io.connect("http://172.28.136.60:8888");
	socket.emit('joinGame');
	
	socket.on('noFreeGames', function() {
		$('#log').append("No free games, creating new one<br/>");
		socket.emit('newGame');
	});
	
	socket.on('gameCreated', function(data) {
		$('#log').append("New game created. Waiting for player to join ...<br/>");
		gameId = data.gameId;
		playerId = 1;
	});
	
	socket.on('gameStart', function(data) {
		$('#log').append("Game starting ...<br/>");
		gameId = data.gameId;
		
		if(playerId == data.turn) {
			$('#log').append('Your turn<br/>');
		} else {
			$('#log').append('Opponent turn<br/>');
		}
	})
	
	socket.on('move', function(data) {
		var changedPosition = "#b"+data.position;
		var value = data.playerId;
		
		$(changedPosition).val(value);
		
		var boxPosition = data.position.substr(1,1);
		for(var i=0; i<9; i++) {
			var disabled = true;
			var tableClass = '';
			
			if(i==boxPosition) {
				disabled = false;
				tableClass = 'success';
			}
			for(var j=0; j<9; j++) {
				$('#b'+i+j).attr('disabled', disabled);
				$('#b'+i+j).parent().attr('class', tableClass);
			}
		}
		
		if(playerId == data.turn) {
			$('#log').append('Your turn<br/>');
		} else {
			$('#log').append('Opponent turn<br/>');
		}			
	});
	
	socket.on('error', function(data) {
		alert(data.description);
	})
	
	socket.on('gameOver', function(data) {
		if(data.winner === 0) {
			alert("DRAW!");
		} else if(data.winner === playerId) {
			alert("You WON!");
		} else {
			alert("You LOST!");
		}
		
		$('.square').attr('disabled', true);
	})
	
	$('.square').click(function() {
		var squareId = $(this).attr('id').substr(1);
		socket.emit('move', {gameId:gameId, playerId:playerId, position:squareId});
	})
});