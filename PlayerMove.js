

function PlayerMove(isPass, data)
{
    this._isPass = isPass;
    this._data =data;
}

PlayerMove.prototype.isMoveTypePass = function isMoveTypePass()
{
    return this._isPass;
}

PlayerMove.prototype.getCards() = function getCards()
{
    return this._data;
}


module.exports  = PlayerMove;
