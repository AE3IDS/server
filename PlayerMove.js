
const GENERALRULE_INDEX = 0;

function PlayerMove(isPass,userId, data)
{
    this._isPass = isPass;
    this._userId = userId;
    this._data =data;
}

PlayerMove.prototype.getUserId = function getUserId()
{
    return this._userId;
}


PlayerMove.prototype.isMoveTypePass = function isMoveTypePass()
{
    return this._isPass;
}

PlayerMove.prototype.getCards = function getCards()
{
    return this._data;
}

PlayerMove.prototype.isMoveStronger = function isMoveStronger(prevPlayerMove)
{
    var prevPlayerCards = prevPlayerMove.getCards();
    var allCardsStronger = true;

    (this._data).forEach(function(item,index){
        allCardsStronger = item.isCardStronger(prevPlayerCards[index]);
    });

    return allCardsStronger;
}

PlayerMove.prototype.isMoveEqualLength = function isMoveEqualLength(prevPlayerMove)
{
     var prevPlayerCards = prevPlayerMove.getCards();
     return (this._data.length == prevPlayerCards.length);
}

module.exports  = PlayerMove;
