var Rule = require("./Rule");

const EIGHT_NUMBER = 8;

function EightEndersRule(){
    Rule.call(this,false,1);
}

EightEndersRule.prototype = new Rule();

EightEndersRule.prototype.getId = function getId(){
    return this.ruleId;
}

EightEndersRule.prototype.checkCard = function checkCard(cards){
    return (cards.indexOf(EIGHT_NUMBER) == -1);
}

module.exports = EightEndersRule;

