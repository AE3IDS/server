var Chance = require('chance').Chance();

const JOKER_SUIT = 0;

function Bot(){

    this._userId = undefined;
    this._photoId = -1;
    this._cards = [];
    this._prevMoveCards = [];
    this._jokersCardIndices = [];
}

Bot.prototype.addCards = function addCards(cards)
{
    this._cards = cards;
    this.getJokers();
} 


Bot.prototype.addMoveCard = function addMoveCard(cards)
{
    this._prevMoveCards.push(cards);
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


Bot.prototype.getJokers = function getJokers()
{
    var _this = this;

    var jokerIndex = this._cards.forEach(function(item,index){

        if(item.getSuit() == JOKER_SUIT)
            _this._jokersCardIndices.push(index);

    })
}


Bot.prototype.getTurnCards = function getTurnCards()
{
    return undefined;
}


Bot.prototype.getPhotoId = function getPhotoId()
{
    return this._photoId;
}


Bot.prototype.setUserId = function setUserId(userId)
{
    this._userId = userId;
}

Bot.prototype.getUserId = function getUserId()
{
    return this._userId
}


module.exports = Bot;


