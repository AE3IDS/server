var https = require('https');
var http = require('http');
var Game = require('./Game').Game();
var colors = require('colors');

var socketServer = require('websocket').server;

var socketHttp = http.createServer(function(request,response){
	console.log((new Date()) + "Received request for" + request.url);
	response.writeHead(404);
	response.end();
});

socketHttp.listen(3000,function(){

	console.log("server listenting on port 3000");
});

var wsServer = new socketServer({
	httpServer:socketHttp,
	autoAcceptConnections:false
});



wsServer.on('request',function(request){
	
	var connection = request.accept('echo-protocol',request.origin);
	
    console.log("connection accepted with IP ".green + request.remoteAddress.green );
	
	connection.on('message',function(message){

		if(message.type === 'utf8'){
            console.log(message.utf8Data);
            
            Game.handleMessage(connection,message.utf8Data);
		}

	})
});
