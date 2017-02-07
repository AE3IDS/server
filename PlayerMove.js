

function PlayerMove(isPass, data)
{
    this._isPass = isPass;
    this._data =data;
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

module.exports  = PlayerMove;
