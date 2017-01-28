var https = require('https');
var http = require('http');
var Game = require('./Game').Game();
var colors = require('colors');

var WebsocketServer = require('ws').Server;
var ws = new WebsocketServer({host:"192.168.2.1",port:3000});

ws.on('connection',function(sock){

    console.log("connection");

    sock.on('message',function(msg){
           
        console.log("receive data".yellow);
        console.log(msg);
        console.log("\n");
        
        Game.handleMessage(sock,msg);     


    });
});
