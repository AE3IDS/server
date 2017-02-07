

function PlayerMove(isPass, data)
{
    this._isPass = isPass;
    this._data =data;
}

PlayerMove.prototype.isMoveTypePass = function isMoveTypePass()
{
    return this._isPass;
}

module.exports  = PlayerMove;
