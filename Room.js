
var Chance = require('chance').Chance();
var User = require("./User");


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

Room.prototype.addPlayer = function addPlayer(){
	
	var newUser = new User();
	this._players.push(newUser);
	
	console.log("user id of user is");
	console.log(newUser.getUserId());

	return newUser.getUserId();
}

module.exports = Room;
