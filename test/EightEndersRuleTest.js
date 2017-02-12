var chai = require('chai');
var expect = chai.expect;
var EightRule = require('../rules/EightEndersRule');
var chance = require('chance').Chance();
var Player = require('../Player');
var Card = require('../Card');

describe("EightEndersRuleTest",function(){
    
    it("getId() shall return a value of R1",function(){
        
        var eRule = new EightRule();
        var id = eRule.getId() == "R1";
        expect(id).to.equal(true);
    })

    it("isActive shall return true",function(){
        
        var eRule = new EightRule();
        expect(eRule.isActive()).to.equal(true);
    })



    it("getRuleName should return Eight Enders",function(){
        
        var eRule = new EightRule();
        var name = eRule.getRuleName() == "Eight Enders";
        expect(name).to.equal(true);
    });
    
    it("checkCard shall return true, if the array consists of one or more cards whose rank is an 8",function(){
    
        var eRule = new EightRule();
        var randNumOfCards = chance.integer({min:1,max:13});

        var cards = [];

        for(var i =0;i < randNumOfCards;i++){

             var randSuit = chance.integer({min:1,max:4});
             var card = new Card(randSuit, 8);
             cards.push(card);

        }
        
        var hasEight = eRule.checkCard(cards);
        expect(hasEight).to.equal(true);

    });

    it("checkCard shall return false, if given array of cards has no 8 cards",function(){
    
        var eRule = new EightRule();
        var randNumOfCards = chance.integer({min:1,max:13});

        var cards = [];

        for(var i =0;i < randNumOfCards;i++){

             var randSuit = chance.integer({min:1,max:4});
             var randSuit = chance.integer({min:3,max:7});
             var card = new Card(randSuit, randSuit);
             cards.push(card);

        }
        
        var hasNoEight = eRule.checkCard(cards);
        expect(hasNoEight).to.equal(false);

    });





});
