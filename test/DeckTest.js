var chai = require('chai');
var expect = chai.expect;
var Deck = require('../Deck');
var Card = require('../Card');

describe('DeckTest',function(){

    it("shuffle should return the same number of cards", function(){
        
        var d = new Deck();
        
        var totalNumOfCards = 0;

        for(var i = 0;i < d._cards.length;i++){
            totalNumOfCards += d._cards[i].length;
        }

        var shuffled = d.shuffle();
        var totalShuffled = 0;

        for(var i = 0;i < shuffled.length;i++){
            totalShuffled += shuffled[i].length;
        }    
    
         expect(totalNumOfCards == totalShuffled).to.equal(true);

    });

    it("shuffle should return array that contains no duplicate",function(){
        var d = new Deck();
        var shuffled = d.shuffle();
        
        var obj = [];
        var duplicate = false;

        for(var i = 0; i <shuffled.length;i++){
            for(var j = 0; j < shuffled[i].length;j++){
                var r = shuffled[i][j];
                if(obj.indexOf(r) == -1){
                    obj.push(r);
                }else{
                    duplicate = true;
                }
            }
        }

        expect(duplicate).to.equal(false);
    })

})
