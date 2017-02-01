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

    
module.exports = RulesHandler;


