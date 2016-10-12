
var Chance = require('chance').Chance();

function Player(avatarId){
    
    this._photoId = avatarId;
    this._cards = [];
	this._userId = Chance.string({length:5});

}

Player.prototype.addCard = function addCard(card){
    this._cards.push(card);
}

Player.prototype.hasCard = function hasCard(card){
    var r = this._cards.filter(function(val){
        return val.isCardEqual(card);
    });

    return r.length != 0;
}

Player.prototype.getPhotoId = function getPhotoId(){
    return this._photoId
}

Player.prototype.getUserId = function getUserId(){
	return this._userId;
}



module.exports  = Player;
