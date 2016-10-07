
var Chance = require('chance').Chance();
var Player = require("./Player");
var colors = require('colors');
var Bot = require('../Bot/Bot');


function Room(seq, mode){

	var randomAlphabet = Chance.character({pool:'ABCDEFGHIJKLMNOPQRSTUVWYZ'});
    
    this._mode = mode;
	this._roomId = randomAlphabet + seq.toString();
	this._roundNum = 1;
	this._maxNumberOfPeople = 4;
	this._players = [];
}

Room.prototype.isRoomAvailable = function isRoomAvailable(){
	return this._players.length != this._maxNumberOfPeople;
}

Room.prototype.getRoomDetails = function getRoomDetails(){
	return {"round":this._roundNum,"players":this._players.length, "roomId":this._roomId}
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
