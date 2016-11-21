var chai = require('chai');
var expect = chai.expect;
var EightRule = require('../EightEndersRule');
var chance = require('chance').Chance();
var Player = require('../Player');

describe("EightEndersRuleTest",function(){
    
    it("getId() shall return a value of 1",function(){
        
        var eRule = new EightRule();
        var id = eRule.getId() == 1;
        expect(id).to.equal(true);

    })

    it("isActive shall return true after calling activate",function(){
        var eRule = new EightRule();
        eRule.activate();
        expect(eRule.isActive()).to.equal(true);
    })


});
