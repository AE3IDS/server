var chai = require('chai');
var expect = chai.expect;
var Deck = require('../Deck');
var Card = require('../Card');

describe('DeckTest',function(){

    it("constructor should have all 54 cards",function(){
    
        var deck = new Deck();
        var cards = deck.getCards();
        expect(cards.length == 54).to.equal(true);
    })

    it("shuffle should return the same number of cards", function(){
        
        var deck = new Deck();    
        var totalNumOfCards = 0;
        var cards = deck.getCards();

        deck.shuffle();
        var cards1 = deck.getCards();

        var totalShuffled = 0;

        for(var i = 0;i < cards1.length;i++){
            totalShuffled += cards1[i].length;
        }    

         expect(cards.length == totalShuffled).to.equal(true);

    });

   it("shuffle should return array that contains no duplicate",function(){
        var deck = new Deck();
        deck.shuffle();
        var shuffledCards = deck.getCards();
        var obj = [];
        var duplicate = false;

        for(var i = 0; i < shuffledCards.length;i++){
            for(var j = 0; j < shuffledCards[i].length;j++){
                var r = shuffledCards[i][j];
                if(obj.indexOf(r) == -1){
                    obj.push(r);
                }else{
                    duplicate = true;
                }
            }
        }

        expect(duplicate).to.equal(false);
    })

    it("shuffle should return array with all the cards present",function(){
        
        var deck = new Deck();
        deck.shuffle();
        var shuffledCards = deck.getCards();

        var HeartSuit = [];
        var ClubSuit = [];
        var DiamonSuit = [];
        var SpadesSuit = [];
        var jokers = [];

        shuffledCards.forEach(function(item){
            item.forEach(function(i){
                if(i.getSuit() == 1){
                    HeartSuit.push(i);
                }else if(i.getSuit() == 2){
                    ClubSuit.push(i);
                }else if(i.getSuit() == 3){
                    DiamonSuit.push(i);
                }else if(i.getSuit() == 4){
                    SpadesSuit.push(i);
                }else{
                    jokers.push(i);
                }
            });        
           
        });

        var sum = HeartSuit.length + ClubSuit.length + DiamonSuit.length + SpadesSuit.length + jokers.length;

        expect(sum == 54).to.equal(true); 
    })

    it("getIndexStartCard shall return the index of the array with Diamond 3 card",function(){
        
        var deck = new Deck();
        deck.shuffle();
        var shuffledCards = deck.getCards();

        var index = deck.getIndexStartCard();
        var foundIndex = -1;

        shuffledCards.forEach(function(item,index){
            item.forEach(function(i){
                if(i.getSuit() == 3 && i.getKind() == 3){
                    foundIndex = index;
                }
            });        
        });

        expect(foundIndex != -1).to.equal(true);
        expect(index == foundIndex).to.equal(true);


        
    });



})
