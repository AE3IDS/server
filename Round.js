var PlayerMove = require('./PlayerMove');


function Round(rules, n){

	this._numOfPass = 0;
	this._rules = rules;
	this._moves = [];
	this._passNumMax = n;
    this._movesWithExtraRules = [];
    this._laterRules = [];
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

Round.prototype.checkMoveExtra = function checkMoveExtra(cards)
{
    var currMove = new PlayerMove(undefined, undefined, cards);
    var newOutput = {};

    var output = currMove.checkExtraRules(this._rules);
    
    console.log(output);

    if(output != undefined) // Doesnt satisfy any extra rules
    {   
        newOutput["newRound"] = output["newRound"];

        if(output["now"])
            newOutput["now"] = output["now"];

        if(output["later"])
            this._laterRules = output["later"];

        this._movesWithExtraRules.push(output["item"]);
    }
    else
    {
        newOutput = undefined;
    }


    return newOutput;
}

Round.prototype.getLaterRules = function getLaterRules()
{
    var data = undefined;

    if(this._laterRules.length > 0)
    {
        var laterRule = this._laterRules.pop();
        data = [laterRule];
    }
    
    return data;
}

Round.prototype.hasPassedMax = function hasPassedMax()
{
	return (this._numOfPass == this._passNumMax);
}


Round.prototype.getWinningId = function getWinningId()
{
    var index = this._moves.length - this._passNumMax - 1;
    return this._moves[index].getUserId();
}


Round.prototype.checkIfReturn = function checkIfReturn(userId)
{
    var index = this._moves.length - this._passNumMax - 1;
    
    if(index >= 0)
        return (this._moves[index].getUserId() == userId);
    else
        return false;
}

Round.prototype.reset = function reset()
{
    this._moves.length = 0;
    this._numOfPass = 0;
}


module.exports = Round;