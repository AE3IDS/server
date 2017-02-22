
function MessageSeq(time, userId,  func)
{
    this._time = time;
    this._func = func;
    this._userId = userId;
}


MessageSeq.prototype.execute = function execute()
{
	setTimeout(this._func, this._time);
}


MessageSeq.prototype.isOwner = function isOwner(userId)
{
	return (this._userId == userId);
}


module.exports = MessageSeq;
