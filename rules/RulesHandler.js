var Jack = require('./JackBack');
var Revolution = require('./Revolution');
var Eight = require('./EightEndersRule');
var Jokers = require('./JokersAreWild');

function RulesHandler()
{
    var jackRule = new Jack();
    var revolution = new Revolution();
    var eightRule = new Eight();
    var jokerRule = new Jokers();

    this._rules = [jackRule, revolution, eightRule, jokerRule];
}

RulesHandler.prototype.getAvailableRules = function getAvailableRules()
{
    
    rules = [];

    this._rules.forEach(function(item){

        var rule = {"ruleName":item.getRuleName(),
                     "ruleDescription":item.getRuleDescription(),
                     "ruleId":item.getId()};

        rules.push(rule);
    });

    return rules;
}

RulesHandler.prototype.getRules = function getRules(ruleIds)
{
    rules = [];
    tempRules = this._rules;

    ruleIds.forEach(function(item,index){
        
        var ruleIndex = -1;
        
        for(var i = 0;i < tempRules.length;i++)
        {
            if(tempRules[i].getId() == item)
            {
                ruleIndex = i;
                break;
            }
        }    


        switch(ruleIndex)
        {
            case 0:
                rules.push(new Jack());
                break;
            case 1:
                rules.push(new Revolution());
                break;
            case 2:
                rules.push(new Eight());
                break;
            case 3:
                rules.push(new Jokers());
                break;
        }

    });
    
    return rules;
}
    
module.exports = RulesHandler;


