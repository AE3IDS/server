var chai = require('chai');
var expect = chai.expect;
var Player = require('../Player');
var Card = require('../Card');

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
   

})

