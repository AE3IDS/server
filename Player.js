
var Chance = require('chance').Chance();

function Player(){
    
    this._photoId = -1;
    this._cards = [];
	this._userId = Chance.string({length:5});

}

Player.prototype.getUserId = function getUserId(){
	return this._userId;
}

Player.prototype.setPhotoId = function setPhotoId(id, /* optional */ selectedPhotoIds){

    if(id == undefined){
    
        while(true){

            id = Chance.natural({min:0,max:5});
            if(!selectedPhotoIds.includes(id)){
                break;
            }           
        }     
    }

    this._photoId = id;

}


module.exports  = Player;
