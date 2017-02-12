
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
    var output = undefined;

    /* get all the extra rules that apply to the given cards */

    var applicableRules = splitRules.filter(function(rule){
        return (rule.checkCard(_this._data) == true);
    })


    if(applicableRules.length > 0)
    {
         /* check if Eight Enders rule is present */

        var hasNoEightEnders = applicableRules.filter(function(rule){
            return rule.getId() == "R1";
        }).length == 0

        /* seperate the rules which one will apply in immediately and later after turn */

        var nowRules = [];
        var laterRules = [];

        applicableRules.forEach(function(item){

            var ruleId = item.getId();
            var ruleName = item.getRuleName();

            _this._extraRules.push(ruleId);

            if(ruleId == "R1" || ruleId == "R3" || hasNoEightEnders)
                nowRules.push(ruleName)
            else
                laterRules.push(ruleName);

        })

        output = {"item":this};

        if(nowRules.length > 0)
            output["now"] = nowRules;

        if(laterRules.length > 0)
            output["later"] = laterRules;

        output["newRound"] = !hasNoEightEnders;
    }

    return output;
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
