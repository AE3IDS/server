var https = require('https');
var http = require('http');
var fs = require('fs');
var socketServer = require('websocket').server;
var Room = require('./Room');
var jsonmaker = require('./JSONMaker');

var rooms = [];

var socketHttp = http.createServer(function(request,response){
	console.log((new Date()) + "Received request for" + request.url);
	response.writeHead(404);
	response.end();
});

socketHttp.listen(3000,function(){
	
	//var test = [ {"response":{"ass":"zxc"}}];
	//console.log(JSON.stringify(test));
   console.log("server listenting on port 3000");
});

var wsServer = new socketServer({
	httpServer:socketHttp,
	autoAcceptConnections:false
});

function createRoom(){

	var r = new Room();	
	rooms.push(r);	
	return r;
}



wsServer.on('request',function(request){
	
	//console.log(request.remoteAddress);
	var connection = request.accept('echo-protocol',request.origin);
	//console.log('connection accepted');
	
	connection.on('message',function(message){
		
					
	})

	
	var added = false;		
	var room = undefined;		

	rooms.forEach(function(item, index){
		console.log(item.isRoomAvailable());
		if(item.isRoomAvailable() && !added){
			added = true;
			room = item;	
		}
	})

	// if added is false, all rooms are occupied. so create new room

	if(!added){
		room = createRoom();
	}
	
	console.log(rooms.length);
	var response = jsonmaker.makeGreetJSON(room.getRoomDetails(),room.addPlayer());
	connection.sendUTF(JSON.stringify(response));

});
