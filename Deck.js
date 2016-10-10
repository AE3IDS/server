var Card = require('./Card');

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

Deck.prototype.shuffle = function shuffle(){

}

module.exports = Deck;
