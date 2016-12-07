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

    it("addDealtCards should add new object of type Cards to dealthCards",function(){

        var player = new Player(1,undefined);
        var data = [];

        var randomCounter = Math.floor(Math.random() * (10 - 0 + 1)) + 0;

        for(var i = 0;i < randomCounter;i++){
            
            var randomSuit =  Math.floor(Math.random() * (4 - 1 + 1)) + 1;
            var randomKind = Math.floor(Math.random() * (15 - 3 +1)) + 3;
            var content = {"suit":randomSuit,"kind":randomKind};
            data.push(content);

        }

        player.addDealtCards(data);
        
        var dealtCards = player.getDealtCards();

        /* Check same length */

        var sameLength = dealtCards.length == data.length;

        expect(sameLength).to.equal(true);

        /* Check content */

        var hasAllData = true;

        dealtCards.forEach(function(item,index){
            var sameSuit = item.getSuit() == data[index]["suit"];
            var sameKind = item.getKind() == data[index]["kind"];
            expect(sameSuit && sameKind).to.equal(true);
        });

    });    

})

