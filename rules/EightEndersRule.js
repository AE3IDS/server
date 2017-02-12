var Rule = require("./Rule");

const EIGHT_NUMBER = 8;

function EightEndersRule(){
    
    var name = "Eight Enders";
    var description = "Terminate the round when any player deals and 8 card";
    var ruleId = "R1";

    Rule.call(this,name,description,ruleId, true);
}

EightEndersRule.prototype = new Rule();

EightEndersRule.prototype.checkCard = function checkCard(cards){

	var allEight = true;

	for(var i = 0;i <cards.length; i++)
		allEight = (cards[i].getKind() == EIGHT_NUMBER);

	return allEight
}

module.exports = EightEndersRule;

