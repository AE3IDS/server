
var Chance = require('chance').Chance();

function Player(avatarId){
    
    this._photoId = avatarId;
    this._cards = [];
	this._userId = Chance.string({length:5});

}

Player.prototype.getPhotoId = function getPhotoId(){
    return this._photoId
}

Player.prototype.getUserId = function getUserId(){
	return this._userId;
}



module.exports  = Player;
