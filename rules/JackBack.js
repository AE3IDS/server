var Rule = require("./Rule");

const JACKCARD_NUMBER = 11;

function JackBack(){
    
    var name = "Jack Back";
    var description = "Reverse the strength of cards when any player deals a Jack card";
    var ruleId = "R2";

    Rule.call(this,name,description,ruleId);
}

EightEndersRule.prototype = new Rule();

module.exports = JackBack;

