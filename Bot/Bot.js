var Chance = require('chance').Chance();

function Bot(){

    this._userId = undefined;
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


Bot.prototype.setUserId = function setUserId(userId)
{
    this._userId = user
}

Bot.prototype.getUserId = function getUserId()
{
    return this._userId
}


module.exports = Bot;


