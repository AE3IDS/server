var Card = require('./Card');
var Chance = require('chance').Chance();

function Deck(){
    
    this._cards = [];

    for(var i = 1; i < 5;i++){
    
        var card = [];
        for(var j = 3; j < 16;j++){
            card.push(new Card(i,j));
        }
        this._cards.push(card);

    }
    
}

function stillHasCards(cards){

    var totalNum = cards.map(function(item){ return item.length == 0 });
     
    return !(totalNum.every(function(elem){ elem == true  }));
}

Deck.prototype.shuffle = function shuffle(){
    
    var cards = this._cards;
    var shuffled = [];
    var temp = [];

    var totalNum = cards.map(function(item){ return item.length; });
    var counter = 0;

    
    for(var i = 0;i < 53;i++){
        
        if((i % totalNum[counter]) == 0){
            if(temp.length > 0){
                shuffled.push(temp);
                temp = [];
                counter++;
            }
        }

        if(i < 52){

            var suit = undefined;
    
            while(stillHasCards(cards)){
                suit = Chance.natural({min:0,max:cards.length-1});
                if(cards[suit].length != 0){
                    break;
                }
            }
        
            var kind = Chance.natural({min:0,max:cards[suit].length-1});
            var deleted = cards[suit].splice(kind,1);   
              
            temp.push(deleted[0])
        }
        
    }

    //shuffled.forEach(function(item){ console.log(item.length) });

    return shuffled;

}

module.exports = Deck;
