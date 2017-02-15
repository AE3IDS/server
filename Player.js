
var Chance = require('chance').Chance();
var Card = require('./Card');

function Player(avatarId, conn){
 
    this._dealtCards = [];   
    this._photoId = avatarId;
    this._cards = [];
	this._userId = Chance.string({length:5});
    this._connection = conn;
    this._cardCount = 0;
}


Player.prototype.getConn = function getConn(){
    return this._connection;
}

Player.prototype.getCard = function getCard(){
    return this._cards;
}

/* -------------- _dealtCards property ---------------- */


Player.prototype.addDealtCards = function addDealtCards(data){

    var dealtCards = this._dealtCards;

    data.forEach(function(item){
        var n = new Card(item["_suit"],item["_kind"]);
        dealtCards.push(n);       
    })
}

Player.prototype.getDealtCards = function getDealtCards(){

    return this._dealtCards;
}


Player.prototype.clearDealt = function clearDealt(){

    this._dealtCards.length = 0;
}


/* -------------- _dealtCards property ---------------- */


/* -------------- _cardCount property ---------------- */


Player.prototype.getCardCount = function getCardCount()
{
    return this._cardCount;
}


Player.prototype.remove = function remove(numOfCards)
{
    this._cardCount = this._cardCount - numOfCards;
}


/* -------------- _cardCount property ---------------- */


Player.prototype.addCard = function addCard(card)
{
    this._cards = card
    this._cardCount = card.length;
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
