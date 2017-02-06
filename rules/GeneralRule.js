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
    var sameRank = undefined;
    var sameSuitAndConsecutive = undefined;

    if(cards.length <= 4)
    	sameRank = this.checkSameRank(cards);

    if(cards.length >= 3)
    	sameSuitAndConsecutive = this.checkSameSuitSequence(cards);


    if(cards.length >= 3)
    {
    	return (sameRank || sameSuitAndConsecutive);
    }
    else
    {
    	return sameRank;
    } 
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

GeneralRule.prototype.checkSameSuitSequence = function checkSameSuitSequence(cards)
{
	var isRuleSatisfy = true;

	if(cards.length >= 3)
	{
		for(var i = 0; (i < cards.length - 1); i++)
		{
			var currKind = cards[i].getKind();
			var nextKind = cards[i+1].getKind();
			var m = nextKind - currKind;

			var currSuit = cards[i].getSuit();
			var nextSuit = cards[i+1].getSuit();

			if(m != 1 || (nextSuit != currSuit))
				isRuleSatisfy = false;
		}
	}
	else
	{
		isRuleSatisfy = false;
	}

	return isRuleSatisfy;
}


module.exports = GeneralRule;

