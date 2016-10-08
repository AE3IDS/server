
var Chance = require('chance').Chance();
var Player = require("./Player");
var colors = require('colors');
var Bot = require('../bot/Bot');
var jsonmaker = require('./JSONMaker');


function Room(seq, mode){

	var randomAlphabet = Chance.character({pool:'ABCDEFGHIJKLMNOPQRSTUVWYZ'});
    
    this._mode = mode;
	this._roomId = randomAlphabet + seq.toString();
	this._roundNum = 1;
	this._maxNumberOfPeople = 4;
	this._players = [];
    this._bots = [];
}

Room.prototype.isRoomAvailable = function isRoomAvailable(){
	return this._players.length != this._maxNumberOfPeople;
}

Room.prototype.sendRoomDetails = function sendRoomDetails(connection,code){

    var details = {"round":this._roundNum, "roomId":this._roomId};
    var output = jsonmaker.makeGreetJSON(details,code);
    connection.sendUTF(JSON.stringify(output));

}

Room.prototype.checkPlayerWithId = function checkPlayerWithId(userId){

	var filtered = this._players.filter(function(val){
				return val.getUserId() == userId
				});
	return filtered.length == 0;
}

Room.prototype.getRoomId = function getRoomId(){
    
    return this._roomId;

}

Room.prototype.addBot = function addBot(numOfBots){

    for(var i = 0; i < numOfBots;i++){
        
        var selectedPhotoIds  = this._players.map(function(item){
            return item.getPhotoId();
        })

        var botPhotoIds = this._bots.map(function(item){
            return item.getPhotoId();
        })

    
        var bt = new Bot(selectedPhotoIds.concat(botPhotoIds));
        this._bots.push(bt);
    }
}

Room.prototype.addPlayer = function addPlayer(avatarId){
	
       
	var newPlayer = new Player(avatarId);
	this._players.push(newPlayer);
	
       
    console.log("-------------- add new user --------------".rainbow);

    /*console.log("photo id of player is " + newPlayer.getPhotoId());
	console.log("user id of player is " + newPlayer.getUserId());

    console.log("------------------------------------------".rainbow);*/

	return newPlayer.getUserId();
}

module.exports = Room;
