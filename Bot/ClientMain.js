var Websocket = require('ws');
var ClientMod = require('./ClientModel');

var ws = new Websocket("ws://192.168.2.1:3000");
var client = new ClientMod(process.argv[2]);

ws.on('open',function()
{
	console.log("client connected");
	client.setSocket(ws);
 	client.initialize();
})

ws.on('message',function(msg){
    
    console.log("receive");
    console.log(msg);
    client.parse(msg);
         
})

ws.on('error',function(err){
    console.log("error occured"+ err.message);
})

