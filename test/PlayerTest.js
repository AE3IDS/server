var chai = require('chai');
var expect = chai.expect;
var Player = require('../Player');
var Card = require('../Card');

describe("PlayerTest",function(){

    it("addCard should increment the number of cards the player has",function(){
        
        var player = new Player();
        
        var numOfCard = 10;

        for(var i =0 ;i < numOfCard;i++){
            player.addCard(new Card(i,i));
        }

        var lengthIsEqual = (player._cards.length == numOfCard);
        expect(lengthIsEqual).to.equal(true); 
    })


    it("hasCard should return true if the player has the cards",function(){
        
        var player = new Player();
        var hasCards = true;

        for(var i = 0;i < 5;i++){
            var card = new Card(i,i);
            player.addCard(card);
        }

        for(var i = 0; i <5;i++){
            hasCards = player.hasCard(new Card(i,i));
        }
        
       expect(hasCards).to.equal(true); 

    });

})

