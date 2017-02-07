var chai = require('chai');
var expect = chai.expect;
var GeneralRule = require('../rules/GeneralRule');
var Card = require('../Card');
var chance = require('chance').Chance();

describe("GeneralRuleTest",function(){
    
    it("checkSameRank shall return true given an array of cards all with the same Kind/Rank",function(){
        
        var randNumOfCards = chance.integer({min:1,max:13});

        var cards = [];

        for(var i = 0; i < randNumOfCards; i++)
        {
            var randSuit = chance.integer({min:1,max:4});
            var card = new Card(randSuit, 5);
            cards.push(card);
        }

        var generalRule = new GeneralRule();
        var ruleSatisfy = generalRule.checkSameRank(cards);

        expect(ruleSatisfy).to.equal(true);

    });

    it("checkSameRank shall return false given an array of cards all with the different Kind/Rank",function(){
        
        var randNumOfCards = chance.integer({min:1,max:13});

        var cards = [];

        for(var i = 0; i < randNumOfCards; i++)
        {
            var randKind = chance.integer({min:3,max:14});
            var card = new Card(5, randKind);
            cards.push(card);
        }

        var generalRule = new GeneralRule();
        var ruleSatisfy = generalRule.checkSameRank(cards);

        expect(ruleSatisfy).to.equal(false);
    });


     it("checkSameRank shall return false given an array of cards with same suit but non-consecutive kind ",function(){
        
        var randNumOfCards = chance.integer({min:0,max:2});

        var cards = [];

        for(var i = 1; i < 30; i*=2)
        {
            var card = new Card(5, i);
            cards.push(card);
        }

        console.log(cards.length);

        var generalRule = new GeneralRule();
        var ruleSatisfy = generalRule.checkSameSuitSequence(cards);

        expect(ruleSatisfy).to.equal(false);

    });

    it("checkSameRank shall return false given an array of cards with different suit but consecutive kind ",function(){
        
        var randNumOfCards = chance.integer({min:1,max:13});

        var cards = [];

        for(var i = 1; i < randNumOfCards; i++)
        {
            var randSuit = chance.integer({min:1,max:4});
            var card = new Card(randSuit, i);
            cards.push(card);
        }

        var generalRule = new GeneralRule();
        var ruleSatisfy = generalRule.checkSameSuitSequence(cards);

        expect(ruleSatisfy).to.equal(false);

    }); 

    it("checkSameRank shall return true given an array of cards with same suit and consecutive kind ",function(){
        
        var randNumOfCards = chance.integer({min:3,max:13});
        var randSuit = chance.integer({min:1,max:4});

        var cards = [];

        for(var i = 1; i < randNumOfCards; i++)
        {
            var card = new Card(randSuit, i);
            cards.push(card);
        }

        var generalRule = new GeneralRule();
        var ruleSatisfy = generalRule.checkSameSuitSequence(cards);
        expect(ruleSatisfy).to.equal(true);

    }); 



});
