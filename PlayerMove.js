
const GENERALRULE_INDEX = 0;

function PlayerMove(isPass,userId, data)
{
    this._isPass = isPass;
    this._userId = userId;
    this._data =data;
    this._extraRules = [];
}

PlayerMove.prototype.check = function check(rules, prevPlayerMove)
{
    var isGeneralRuleSatisfy = rules[GENERALRULE_INDEX].checkCard(this._data);
    var isValid = true;

    if(prevPlayerMove != undefined)
    {
        isValid = this.isMoveEqualLength(prevPlayerMove);
        if(isValid)
            isValid = this.isMoveStronger(false, prevPlayerMove);
    }

    var allRuleSatisfied = (isGeneralRuleSatisfy && isValid);
    return allRuleSatisfied;
}


PlayerMove.prototype.checkExtraRules = function checkExtraRules(rules)
{
    var startIndex = GENERALRULE_INDEX + 1;
    var splitRules = rules.slice(startIndex);

    var _this = this;

    var applicableRules = splitRules.filter(function(rule){
        return (rule.checkCard(_this._data) == true);
    })

    var rulesName = [];

    applicableRules.forEach(function(item){

        _this._extraRules.push(item.getId());
        rulesName.push(item.getRuleName());

    })

    return {"item":this,"rules":rulesName};
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

PlayerMove.prototype.isMoveStronger = function isMoveStronger(reverse, prevPlayerMove)
{
    var prevPlayerCards = prevPlayerMove.getCards();
    var allCardsStronger = true;

    (this._data).forEach(function(item,index){

        var t = item.isCardStronger(prevPlayerCards[index]);
        allCardsStronger = ( reverse ? !t : t );

    });

    return allCardsStronger;
}


PlayerMove.prototype.isMoveEqualLength = function isMoveEqualLength(prevPlayerMove)
{
     var prevPlayerCards = prevPlayerMove.getCards();
     return (this._data.length == prevPlayerCards.length);
}

module.exports  = PlayerMove;
