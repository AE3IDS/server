var Rule = require("./Rule");

function GeneralRule(){
    
    var name = "General";
    var description = "A";
    var ruleId = "R1";

    Rule.call(this,name,description,ruleId);
}

GeneralRule.prototype = new Rule();



module.exports = GeneralRule;

