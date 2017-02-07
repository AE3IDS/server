
function Round(n){

	this._numOfPass = 0;
	this._passNumMax = n
}

Round.prototype.hasPassedMax = function hasPassedMax()
{
	return (this._numOfPass == this._passNumMax);
}


module.exports = Round;