var Card = require('./Card');
var Chance = require('chance').Chance();


const TOTALNUM_OF_CARD = 54;
const MAX = 4;


function Deck(){
    
    this._cards = [];

    for(var i = 1; i < 5;i++)
    {
        for(var j = 3; j < 16;j++)
            this._cards.push(new Card(i,j));
    }

    // Add 2 jokers

    this._cards.push(new Card(0,0));
    this._cards.push(new Card(0,0));

    
}

function stillHasCards(cards){

    var totalNum = cards.map(function(item){ return item.length == 0 });
     
    return !(totalNum.every(function(elem){ elem == true  }));
}

Deck.prototype.shuffle = function shuffle(){

    var maxNum = TOTALNUM_OF_CARD;
    var shuffled = [[]];
    var drawnIndex = [];
    var divideProportion = [14,14,13,13];
    var divideIndex = 0;
    var val = divideProportion[divideIndex];
    var temp = [];


    while(maxNum > -1)
    {
        if(TOTALNUM_OF_CARD - val == maxNum)
        {
            shuffled.push([]);
            divideIndex++;
            val += divideProportion[divideIndex];

            if(maxNum == 0)
                break;
        }

        var randCardIndex = Chance.natural({min:0,max:TOTALNUM_OF_CARD-1});

        if(drawnIndex.indexOf(randCardIndex) == -1)
        {
            shuffled[divideIndex].push(this._cards[randCardIndex]);
            drawnIndex.push(randCardIndex);
            maxNum--; 
        }

    }

    shuffled.pop();
    this._cards = shuffled;
    //shuffled.forEach(function(item){ console.log(item.length) })
}

Deck.prototype.getCards = function getCards(){
    return this._cards;
}

Deck.prototype.getIndexStartCard = function getIndexStartCard(){

    for(var i = 0; i < this._cards.length;i++){
        for(var j = 0; j < this._cards[i].length;j++){
            if(this._cards[i][j].isCardEqual(new Card(3,3))){
                return i;
            } 
        }
    }

}

module.exports = Deck;
