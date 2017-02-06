var chai = require('chai');
var expect = chai.expect;
var RulesHandler = require('../rules/RulesHandler');
var chance = require('chance').Chance();

describe("RuleHandlerTest",function(){
    
    it("getAvailableRules shall return an array with the same number of items as the _rules property",function(){
        
        var ruleHandler = new RulesHandler();
        var rules = ruleHandler.getAvailableRules();
        expect(rules.length == ruleHandler._rules.length).to.equal(true);

    });

    it("getAvailableRules shall return the same items as in the _rules array property",function(){

        var ruleHandler = new RulesHandler();
        var rules = ruleHandler.getAvailableRules();
    
        rules.forEach(function(item,index){

            var nameEqual = (item.ruleName == ruleHandler._rules[index].getRuleName());
            var descriptionEqual = (item.ruleDescription == ruleHandler._rules[index].getRuleDescription());
            var ruleIdEqual = (item.ruleId == ruleHandler._rules[index].getId());

            expect(nameEqual && descriptionEqual && ruleIdEqual).to.equal(true);
        });

    });

    it("getRules should return an array of the same length as the array arg",function(){
    
        var ruleHandler = new RulesHandler();
        var rules = ruleHandler.getRules(["R1","R2"]);

        expect(rules.length == 2).to.equal(true);

    })

    it("getRules should return an array whose items are rules with the same Id as in the array arguments",function(){
        
        var testData = ["R1","R2"];
        
        var ruleHandler = new RulesHandler();
        var rules = ruleHandler.getRules(testData);
        
        rules.forEach(function(item,index){
            expect(item.getId() == testData[index]).to.equal(true);
        });
            

    })

});
