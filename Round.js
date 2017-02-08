var PlayerMove = require('./PlayerMove');


function Round(rules, n){

	this._numOfPass = 0;
	this._rules = rules;
	this._moves = [];
	this._passNumMax = n
}

Round.prototype.addMove = function addMove(isPass, userId, cards)
{
    // convert q to a set of moves

    var currMove = new PlayerMove(isPass,userId,cards);
    var isMoveValid = undefined; //check if zero 
    var output = undefined;
    
	
    if(this._moves.length != 0)
    {
        var prevMove = this._moves[this._moves.length-1];
        
        var curr = currMove.isMoveTypePass();
        var prev = prevMove.isMoveTypePass();

        if(!curr && prev)               // if curr is not pass and prev is Pass
        {
            this._numOfPass = 0;
        }
        else if (!curr && !prev) 
        {
            isMoveValid = currMove.check(this._rules,prevMove);
        }
        else
        {
            this._numOfPass++;          // if q is pass and s is pass &&                        
        }                               // if q is pass and s is not pass
    }

    if(isPass == false && isMoveValid == undefined)
        isMoveValid = currMove.check(this._rules);

    if(isMoveValid || isPass == true)
    {
        this._moves.push(currMove);
        output = true;
    }
    else
    {
        output = false;
    }

    // console.log(this._moves.length);

    return output;
}

Round.prototype.hasPassedMax = function hasPassedMax()
{
	return (this._numOfPass == this._passNumMax);
}


module.exports = Round;