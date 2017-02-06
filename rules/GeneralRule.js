var Rule = require("./Rule");

function GeneralRule(){
    
    var name = "General";
    var description = "A";
    var ruleId = "R1";

    Rule.call(this,name,description,ruleId);
}

GeneralRule.prototype = new Rule();


GeneralRule.prototype.checkCard = function checkCard(cards)
{
    var r = checkSameRank(cards);
    return r;
}

GeneralRule.prototype.checkSameRank = function checkSameRank(cards)
{
	var pivot = cards[0];
	var isRuleSatisfy = true;

	for(var i = 1; (i < cards.length && isRuleSatisfy); i++)
	{
		isRuleSatisfy = cards[i].getKind() == pivot.getKind();
	}

	return isRuleSatisfy;
}


module.exports = GeneralRule;

