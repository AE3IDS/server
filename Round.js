var PlayerMove = require('./PlayerMove');


function Round(rules, n){

	this._numOfPass = 0;
	this._rules = rules;
	this._moves = [];
	this._passNumMax = n;
    this._movesWithExtraRules = [];
    this._laterRules = {};
    this._nowRules = {};
    this._startNewRound = false;
}



Round.prototype.addMove = function addMove(isPass, userId, cards)
{
    // convert q to a set of moves

    var currMove = new PlayerMove(isPass,userId,cards);
    var isMoveValid = undefined; //check if zero 
    var output = false;

	
    if(this._moves.length != 0)
    {
        var prevMove = this._moves[this._moves.length-1];

        var curr = currMove.isMoveTypePass();
        var prev = prevMove.isMoveTypePass();

        if(!curr)
        {
            if(prev)
            {
                 this._numOfPass = 0;
                 prevMove = undefined;
            }

            isMoveValid = currMove.check(this._rules,prevMove, this._movesWithExtraRules);
        }
    }

    this._numOfPass += isPass?1:0;

    if(isPass == false && isMoveValid == undefined)
        isMoveValid = currMove.check(this._rules, undefined, this._movesWithExtraRules);

    if(isMoveValid || isPass == true)
    {
        this._moves.push(currMove);
        output = true;
    }

    return output;
}

Round.prototype.checkMoveExtra = function checkMoveExtra(cards)
{
    var currMove = new PlayerMove(undefined, undefined, cards);
    var output = currMove.checkExtraRules(this._rules);
    var hasRules = false;
    
    console.log(output);

    if(output != undefined) // Doesnt satisfy any extra rules
    {   
        this._startNewRound = output["newRound"];

        if(output["now"])
            this._nowRules = processRules(output["now"]);

        if(output["later"])
            this._laterRules = processRules(output["later"]);

        hasRules = true;

        this._movesWithExtraRules.push(currMove);
    }

    return hasRules;
}


function processRules(rules)
{
    var name = [];
    var id = [];

    rules.forEach(function(item){

        var ruleId = (Object.keys(item)).pop();

        id.push(ruleId);
        name.push(item[ruleId]);

    });

    return {"ruleName":name,"ruleId":id}
}

Round.prototype.getNowRules = function getNowRules()
{
    return this._nowRules
}


Round.prototype.willStartNewRound = function willStartNewRound()
{
    return this._startNewRound;
}


Round.prototype.getLaterRules = function getLaterRules()
{
    return this._laterRules;
}


Round.prototype.hasPassedMax = function hasPassedMax()
{
    var hasWin = false;

    var isMaxPass = (this._numOfPass == this._passNumMax);

    if(isMaxPass)
    {
        var index = this._moves.length - this._passNumMax-1;
        hasWin = !this._moves[index].isMoveTypePass();
    }

    return hasWin;
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
