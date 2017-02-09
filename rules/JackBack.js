var Rule = require("./Rule");

const JACKCARD_NUMBER = 11;

function JackBack(){
    
    var name = "Jack Back";
    var description = "Reverse the strength of cards when any player deals a Jack card";
    var ruleId = "R2";

    Rule.call(this,name,description,ruleId);
}

JackBack.prototype = new Rule();

JackBack.prototype.checkCard = function checkCard(cards){

	var c = cards.filter(function(item){
		return (item.getKind() == JACKCARD_NUMBER);
	})

	return (c.length != 0);
}

module.exports = JackBack;

