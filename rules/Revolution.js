var Rule = require("./Rule");

const MINNUMBER_OF_CARDS = 4;

function Revolution(){
    
    var name = "Revolution";
    var description = "asdfs";
    var ruleId = "R4";

    Rule.call(this,name,description,ruleId);
}

Revolution.prototype = new Rule();

Revolution.prototype.checkCard = function checkCard(cards){

	if(cards.length != MINNUMBER_OF_CARDS)
	{
		return false;
	}
	else
	{
		var firstCard = cards[0];

		for(var counter = 1; counter < cards.length; counter++)
		{
			if(cards[counter].getKind() != firstCard.getKind())
				return false;
		}

		return true;
	}

}

module.exports = Revolution;

