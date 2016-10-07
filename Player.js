
var Chance = require('chance').Chance();

function Player(avatarId, /*optional */ selectedPhotoIds){
    
    this._photoId = avatarId == undefined?getRandomPhotoId(selectedPhotoIds):avatarId;
    this._cards = [];
	this._userId = Chance.string({length:5});

}

Player.prototype.getUserId = function getUserId(){
	return this._userId;
}

function getRandomPhotoId( selectedPhotoIds){

    while(true){

        var id = Chance.natural({min:0,max:5});
        if(!selectedPhotoIds.includes(id)){
            return id;
        }           
    }     
}


module.exports  = Player;
