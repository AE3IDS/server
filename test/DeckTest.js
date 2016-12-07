var chai = require('chai');
var expect = chai.expect;
var Deck = require('../Deck');
var Card = require('../Card');

describe('DeckTest',function(){

    it("constructor should have 4 valid suits",function(){

        var deck = new Deck();
        var deckTest = [];
        var allDeckPresent = true;

        deck._cards.forEach(function(item){
            deckTest.push(item[0].getSuit());
        });

        deckTest.forEach(function(item,index){
            allDeckPresent = (deckTest[index] == index+1);
        });

        expect(allDeckPresent && deckTest.length == 4).to.equal(true);
    })

    it("constructor should have all 53 cards",function(){
    
        var deck = new Deck();
        var cards = deck.getCards();
        var numOfCards = 0;
        var allCardKindPresent = true;

        cards.forEach(function(item){
            numOfCards += item.length;
            var cardKindNumber = 3;
            item.forEach(function(cardItem){
                allCardKindPresent = (cardItem.getKind() == cardKindNumber);
                cardKindNumber += 1;
            })
        });
        
        expect(numOfCards == 52 && allCardKindPresent).to.equal(true);



    })

    it("shuffle should return the same number of cards", function(){
        
        var deck = new Deck();    
        var totalNumOfCards = 0;
        var cards = deck.getCards();

        for(var i = 0;i < cards.length;i++){
            totalNumOfCards += cards[i].length;
        }

        deck.shuffle();
        cards = deck.getCards();

        var totalShuffled = 0;

        for(var i = 0;i < cards.length;i++){
            totalShuffled += cards[i].length;
        }    
 
        

         expect(totalNumOfCards == totalShuffled).to.equal(true);

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
                }
            });        
           
        });

        var Hearthas13 = HeartSuit.length == 13;
        var Clubhas13 = ClubSuit.length == 13;
        var Diamonhas13 = DiamonSuit.length == 13;
        var Spadeshas13 = SpadesSuit.length == 13;
        
        var output = Hearthas13 && Clubhas13 && Diamonhas13 && Spadeshas13;

        expect(output).to.equal(true); 
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
