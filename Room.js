var User = require("./User");

function Room(){
	this._roundNum = 1;
	this._maxNumberOfPeople = 4;
	this._players = [];
}

Room.prototype.isRoomAvailable = function isRoomAvailable(){
	return this._players.length == this._maxNumberOfPeople;
}

Room.prototype.getRoomDetails = function getRoomDetails(){
	return {"round":this_roundNum,"players":this._players.length}
}

Room.prototype.checkPlayerWithId = function checkPlayerWithId(userId){

	var filtered = this._players.filter(function(val){
				return val.getUserId() == userId
				});
	return filtered.length == 0;
}

Room.prototype.addPlayer = function addPlayer(){
	
	var newUser = new User();
	this._players.push(newUser);	
	
	return newUser.getUserId();
}

module.exports = Room;
