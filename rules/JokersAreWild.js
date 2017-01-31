var Rule = require("./Rule");

function JokersAreWild(){
    
    var name = "Jokers are Wild";
    var description = "asdfs";
    var ruleId = "R3";

    Rule.call(this,name,description,ruleId);
}

JokersAreWild.prototype = new Rule();

module.exports = JokersAreWild;

