var https = require('https');
var http = require('http');
var fs = require('fs');
var socketServer = require('websocket').server;
var Room = require('./Room');

var socketHttp = http.createServer(function(request,response){
	console.log((new Date()) + "Received request for" + request.url);
	response.writeHead(404);
	response.end();
});

socketHttp.listen(3000,function(){
	var r = new Room();
	console.log(r.isRoomAvailable());
   console.log("server listenting on port 3000");
});

var wsServer = new socketServer({
	httpServer:socketHttp,
	autoAcceptConnections:false
});

wsServer.on('request',function(request){
	
	console.log(request.remoteAddress);
	var connection = request.accept('echo-protocol',request.origin);
	console.log('connection accepted');
	connection.on('message',function(message){
		
					
	})
});
