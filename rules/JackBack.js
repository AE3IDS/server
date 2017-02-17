var Rule = require("./Rule");

const JACKCARD_NUMBER = 11;

function JackBack(){
    
    var name = "Jack Back";
    var description = "Reverse the strength of cards when any player deals a Jack card";
    var ruleId = "R2";

    Rule.call(this,name,description,ruleId, false, true);
}

JackBack.prototype = new Rule();

JackBack.prototype.checkCard = function checkCard(cards){

	var isJack = true;

	for(var counter = 0; (counter < cards.length && isJack);counter++)
		isJack = (cards[counter].getKind() == JACKCARD_NUMBER);

	return isJack;
}

module.exports = JackBack;

