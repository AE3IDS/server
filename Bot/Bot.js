var Chance = require('chance').Chance();

function Bot(){

    this._userId = Chance.string({length:5}); 
    this._photoId = -1;
}


Bot.prototype.setPhotoId = function setPhotoId(selectedPhotoIds)
{
    while(true)
    {
        var id = Chance.natural({min:0,max:8});
        
        if(selectedPhotoIds.indexOf(id) == -1)
        {    
            this._photoId = id;
            break;
        }
    }            
}


Bot.prototype.getPhotoId = function getPhotoId()
{
    return this._photoId;
}

module.exports = Bot;


