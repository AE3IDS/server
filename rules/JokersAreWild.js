var Rule = require("./Rule");
var Card = require("../Card");

const JOKER_SUIT = 0;
const JOKER_RANK = 1;

function JokersAreWild(){
    
    var name = "Jokers are Wild";
    var description = "asdfs";
    var ruleId = "R3";

    Rule.call(this,name,description,ruleId);
}

JokersAreWild.prototype = new Rule();

JokersAreWild.prototype.checkCard = function checkCard(cards)
{
	// check if joker are present

	var notJokers = cards.filter(function(item){
		return (item.getSuit() != JOKER_SUIT && item.getKind() != JOKER_RANK);
	})

	var jokers = cards.filter(function(item){
		return (item.getSuit() == JOKER_SUIT && item.getKind() == JOKER_RANK);
	})

	var isRuleApplicable = false;

	if(jokers.length != 0)
	{
		// Some cards are jokers and some are not
		// Check if non-jokers card are of the same rank

		var firstCard = notJokers[0];
		var sameRank = true;

		for(var index = 1; (index < notJokers.length && sameRank);index++)
			sameRank = (notJokers[index].getKind() == firstCard.getKind()); 

		if(sameRank)
		{
			// If all non-jokers are of the same rank
			// Replace all jokers with non-jokers

			jokers.forEach(function(item){
				var jokerIndex = cards.indexOf(item);
				cards[jokerIndex] = new Card(firstCard.getSuit(),firstCard.getKind());
			})

			isRuleApplicable = true;
		}

	}

	return isRuleApplicable;

}

module.exports = JokersAreWild;

