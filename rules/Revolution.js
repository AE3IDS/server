var Rule = require("./Rule");

function Revolution(){
    
    var name = "Revolution";
    var description = "asdfs";
    var ruleId = "R4";

    Rule.call(this,name,description,ruleId);
}

Revolution.prototype = new Rule();

module.exports = Revolution;

