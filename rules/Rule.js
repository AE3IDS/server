
function Rule(name,description,id, active)
{    
    this.ruleName = name;
    this.description = description;
    this.ruleId = id;
    this._isActive = active;
}

Rule.prototype.isActive = function isActive()
{
	return this._isActive;
}

Rule.prototype.activate = function activate()
{
	this._isActive = true;
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

Rule.prototype.getJSONInfo = function getJSONInfo()
{
	return {"ruleId":this.ruleId,"ruleName":this.ruleName};
}

Rule.prototype.getRuleDescription = function getRuleDescription()
{
    return this.description;
}

module.exports = Rule;
