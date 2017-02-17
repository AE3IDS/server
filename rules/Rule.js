
function Rule(name,description,id, active, isPersistent)
{    
    this.ruleName = name;
    this.description = description;
    this.ruleId = id;
    this._isActive = active;
    this._isPersistent = isPersistent;
}

Rule.prototype.isPersistent = function isPersistent()
{
    return this._isPersistent;
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
    var info = {};
    info[this.ruleId] = this.ruleName;

	return info;
}

Rule.prototype.getRuleDescription = function getRuleDescription()
{
    return this.description;
}

module.exports = Rule;
