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
    
module.exports = RulesHandler;


