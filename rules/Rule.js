
function Rule(name,description,id)
{    
    this.ruleName = name;
    this.description = description;
    this.ruleId = id;
}

Rule.prototype.checkCard = function checkCard(card){}

Rule.prototype.getId = function getId()
{    
    return this.ruleId;   
}

Rule.prototype.getRuleName = function getRuleName()
{
    return this.ruleName;
}

Rule.prototype.getRuleDescription = function getRuleDescription()
{
    return this.description;
}

module.exports = Rule;
