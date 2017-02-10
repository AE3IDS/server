var chai = require('chai');
var expect = chai.expect;
var JokersAreWild = require('../rules/JokersAreWild');
var chance = require('chance').Chance();
var Card = require('../Card');

describe("JokersAreWildTest",function(){

    it("checkCard shall return false, given an array of cards that does not contain any jokers",function(){
    
        var joker = new JokersAreWild();
        var randNumOfCards = chance.integer({min:1,max:13});

        var cards = [];

        for(var i =0;i < randNumOfCards;i++){

             var randSuit = chance.integer({min:1,max:4});
             var randKind = chance.integer({min:3,max:16});

             var card = new Card(randSuit, randKind);
             cards.push(card);
        }
        
        expect(joker.checkCard(cards)).to.equal(false);
    });

    it("checkCard shall return false, given an array of cards that contain some jokers but non-jokers are of different rank",function(){
    
        var joker = new JokersAreWild();
        var randNumOfCards = chance.integer({min:1,max:5});
        var randKind = chance.integer({min:3,max:16});

        var cards = [];

        for(var i =0;i < randNumOfCards;i++){

             var randSuit = chance.integer({min:1,max:4});
             var card = new Card(randSuit, randKind+i);
             cards.push(card);
        }

        var randNumOfJokers = chance.integer({min:1,max:5});

        for(var i =0; i < randNumOfJokers;i++)
            cards.push(new Card(0, 1))
        
        expect(joker.checkCard(cards)).to.equal(false);
    });

    it("checkCard shall return true, given an array of cards that contain some jokers and non-jokers are of same rank",function(){
    
        var joker = new JokersAreWild();
        var randNumOfCards = chance.integer({min:1,max:5});
        var randKind = chance.integer({min:3,max:16});

        var cards = [];

        for(var i =0;i < randNumOfCards;i++){

             var randSuit = chance.integer({min:1,max:4});
             var card = new Card(randSuit, randKind);
             cards.push(card);
        }

        var randNumOfJokers = chance.integer({min:1,max:5});

        for(var i =0; i < randNumOfJokers;i++)
            cards.push(new Card(0, 1))
        
        expect(joker.checkCard(cards)).to.equal(true);
    });

    it("checkCard shall modify the original argument array of cards that contains jokers, to non-jokers that are of the same rank to the other non-jokers",function(){
    
        var joker = new JokersAreWild();
        var randNumOfCards = chance.integer({min:1,max:5});
        var randKind = chance.integer({min:3,max:16});

        var cards = [];

        for(var i =0;i < randNumOfCards;i++){

             var randSuit = chance.integer({min:1,max:4});
             var card = new Card(randSuit, randKind);
             cards.push(card);
        }

        var randNumOfJokers = chance.integer({min:1,max:5});

        for(var i =0; i < randNumOfJokers;i++)
            cards.push(new Card(0, 1))
        

        joker.checkCard(cards);

        var jokers = cards.filter(function(item){
            return (item.getKind() == 1 && item.getSuit() == 0);
        })

        expect(jokers.length == 0).to.equal(true);


    });






});
