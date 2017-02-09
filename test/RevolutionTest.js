var chai = require('chai');
var expect = chai.expect;
var Revolution = require('../rules/Revolution');
var chance = require('chance').Chance();
var Card = require('../Card');

describe("Revolution",function(){

    it("checkCard shall return false, given an array that consists of less than 4 items",function(){
    
        var rev = new Revolution
        var randNumOfCards = chance.integer({min:1,max:3});

        var cards = [];

        for(var i =0;i < randNumOfCards;i++){

             var randSuit = chance.integer({min:1,max:4});
             var randKind = chance.integer({min:3,max:16});

             var card = new Card(randSuit, randKind);
             cards.push(card);
        }
        
        expect(rev.checkCard(cards)).to.equal(false);
    });

    it("checkCard shall return false, given an array that consists of more than 4 items",function(){
    
        var rev = new Revolution
        var randNumOfCards = chance.integer({min:5,max:13});

        var cards = [];

        for(var i =0;i < randNumOfCards;i++){

             var randSuit = chance.integer({min:1,max:4});
             var randKind = chance.integer({min:3,max:16});

             var card = new Card(randSuit, randKind);
             cards.push(card);
        }
        
        expect(rev.checkCard(cards)).to.equal(false);
    });

    it("checkCard shall return true, given an array that consists of four cards that are of the same kind/rank",function(){
    
        var rev = new Revolution();
        var randKind = chance.integer({min:3,max:15});
        var cards = [];

        for(var i =0;i < 4;i++){

             var randSuit = chance.integer({min:1,max:4});
             var card = new Card(randSuit, randKind);
             cards.push(card);
        }
        
        expect(rev.checkCard(cards)).to.equal(true);
    });

    it("checkCard shall return false, given an array that consists of four item cards that are of different kind/rank",function(){
    
        var rev = new Revolution();
        var cards = [];

        for(var i =0;i < 4;i++){

             var randSuit = chance.integer({min:1,max:4});
             var randKind = chance.integer({min:5,max:15});
             var card = new Card(randSuit, randKind);
             cards.push(card);
        }
        
        expect(rev.checkCard(cards)).to.equal(false);
    });

    // it("checkCard shall return false, if given array of cards has no 8 cards",function(){
    
    //     var eRule = new EightRule();
    //     var randNumOfCards = chance.integer({min:1,max:13});

    //     var cards = [];

    //     for(var i =0;i < randNumOfCards;i++){

    //          var randSuit = chance.integer({min:1,max:4});
    //          var randSuit = chance.integer({min:3,max:7});
    //          var card = new Card(randSuit, randSuit);
    //          cards.push(card);

    //     }
        
    //     var hasNoEight = eRule.checkCard(cards);
    //     expect(hasNoEight).to.equal(false);

    // });





});
