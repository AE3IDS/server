//var ws = require('websocket').client;

var Websocket = require('ws');
var ws = new Websocket("ws://127.0.0.1:3000");

ws.on('open',function(){
    console.log("client connected");
})

ws.on('message',function(msg){
    
    console.log("receive");
    console.log(msg);
        
})

ws.on('error',function(err){
    console.log("error occured"+ err.message);
})

/*var colors = require('colors');
var fs = require('fs');
var client = new ws();

client.on('connectFailed',function(error){
	console.log(('Connect Error' + error.toString()).red);
})

client.on('connect',function(connection){
	
	connection.on('message',function(message){
		var data = message.binaryData;
		fs.writeFile('baymax.png',data,{mode:0777},function(err){
			if(err){
				console.log("error writing");
			}
		}) 
	
		console.log(message.binaryData.length);
	});

	console.log("client connected successfully".green);
	connection.sendUTF('asdfs');
	
})

client.connect('ws://dennyhartanto.com:3000','echo-protocol');*/
