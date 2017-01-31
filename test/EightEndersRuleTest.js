var chai = require('chai');
var expect = chai.expect;
var EightRule = require('../rules/EightEndersRule');
var chance = require('chance').Chance();
var Player = require('../Player');

describe("EightEndersRuleTest",function(){
    
    it("getId() shall return a value of R1",function(){
        
        var eRule = new EightRule();
        var id = eRule.getId() == "R1";
        expect(id).to.equal(true);
    })

    it("getRuleName should return Eight Enders",function(){
        
        var eRule = new EightRule();
        var name = eRule.getRuleName() == "Eight Enders";
        expect(name).to.equal(true);
    });
    
    it("checkCard shall return true if the array consists of more than one 8's",function(){
    
        var eRule = new EightRule();
        var randomNumbers = [];

        for(var i =0;i < 13;i++){
            var randomCardKind = Math.floor(Math.random() * (16-3+1)) +3;
            randomNumbers.push(randomCardKind);
        }
        
        var randomIndex =  Math.floor(Math.random() * (randomNumbers.length-0+1))+0;
        randomNumbers[randomIndex] = 8;
            
        var hasNoEight = eRule.checkCard(randomNumbers) 
        

        expect(hasNoEight).to.equal(false);


    });





});
