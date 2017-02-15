var chai = require('chai');
var expect = chai.expect;
var Player = require('../Player');
var Card = require('../Card');
var Chance = require('chance').Chance();

describe("PlayerTest",function(){

    it("addCard should increment the number of cards the player has",function(){
        
        var player = new Player();
        
        var numOfCard = 10;
        var cards = [];

        for(var i =0 ;i < numOfCard;i++){
            cards.push(new Card(i,i));
        }

        player.addCard(cards);

        var lengthIsEqual = (player.getCard().length == numOfCard);
        expect(lengthIsEqual).to.equal(true); 
    })

    it("remove should decrease the cardCount property value, based on the value of the argument",function(){
        
        var player = new Player();
        var numOfCards = Chance.natural({min:1,max:13});
        var numOfCardsToBeRemoved = Chance.natural({min:1,max:13});

        var cards = [];

        for(var i =0 ;i < numOfCards;i++){
            cards.push(new Card(i,i));
        }

        player.addCard(cards);
        player.remove(numOfCardsToBeRemoved);

        var s = (player.getCardCount() == (player.getCard().length - numOfCardsToBeRemoved));
        expect(s).to.equal(true); 
    })


   

})

