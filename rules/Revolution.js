var Rule = require("./Rule");

const EIGHT_NUMBER = 8;

function EightEndersRule(){
    
    var name = "Eight Enders";
    var description = "Terminate the round when any player deals and 8 card";
    var ruleId = "R1";

    Rule.call(this,name,description,ruleId);
}

EightEndersRule.prototype = new Rule();

EightEndersRule.prototype.checkCard = function checkCard(cards){
    return (cards.indexOf(EIGHT_NUMBER) == -1);
}

module.exports = EightEndersRule;

