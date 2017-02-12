var chai = require('chai');
var expect = chai.expect;
var PlayerMove = require('../PlayerMove');
var Card = require('../Card');
var chance = require('chance').Chance();

describe("PlayerMoveTest",function(){
    
    it("isMoveStronger shall return true if given a set of cards that have weakers trength, as argument reverse is false",function(){
        
        var weakCardKind = chance.integer({min:3,max:6});
        var strongCardKind = chance.integer({min:7,max:14});

        var randWeakCardSuit = chance.integer({min:1,max:4});
        var randStrongCardSuit = chance.integer({min:1,max:4});

        var weakCards = [];
        var strongCards = [];

        for(var i = 0; i < 3; i++)
        {
            var weakCard = new Card(randWeakCardSuit, weakCardKind);
            var strongCard = new Card(randStrongCardSuit, strongCardKind);

            weakCards.push(weakCard);
            strongCards.push(strongCard);
        }

        var weakCardsMove = new PlayerMove(false,"asdfs",weakCards);
        var strongCardsMove = new PlayerMove(false,"asdfs",strongCards);

        var isStronger = strongCardsMove.isMoveStronger(false, weakCardsMove);

        expect(isStronger).to.equal(true);

    });

    it("isMoveStronger shall return false if given a set of cards that have weakers trength, as argument reverse is true",function(){
        
        var weakCardKind = chance.integer({min:3,max:6});
        var strongCardKind = chance.integer({min:7,max:14});

        var randWeakCardSuit = chance.integer({min:1,max:4});
        var randStrongCardSuit = chance.integer({min:1,max:4});

        var weakCards = [];
        var strongCards = [];

        for(var i = 0; i < 3; i++)
        {
            var weakCard = new Card(randWeakCardSuit, weakCardKind);
            var strongCard = new Card(randStrongCardSuit, strongCardKind);

            weakCards.push(weakCard);
            strongCards.push(strongCard);
        }

        var weakCardsMove = new PlayerMove(false,"asdfs",weakCards);
        var strongCardsMove = new PlayerMove(false,"asdfs",strongCards);

        var isStronger = strongCardsMove.isMoveStronger(true, weakCardsMove);

        expect(isStronger).to.equal(false);

    });





    it("isMoveStronger shall return false if given a set of cards that have higher strength, as argument and reverse is false",function(){
        
        var weakCardKind = chance.integer({min:3,max:6});
        var strongCardKind = chance.integer({min:7,max:14});

        var randWeakCardSuit = chance.integer({min:1,max:4});
        var randStrongCardSuit = chance.integer({min:1,max:4});

        var weakCards = [];
        var strongCards = [];

        for(var i = 0; i < 3; i++)
        {
            var weakCard = new Card(randWeakCardSuit, weakCardKind);
            var strongCard = new Card(randStrongCardSuit, strongCardKind);

            weakCards.push(weakCard);
            strongCards.push(strongCard);
        }

        var strongCardsMove = new PlayerMove(false,"asdfs",strongCards);
        var weakCardsMove = new PlayerMove(false,"asdfs",weakCards);

        var isStronger = weakCardsMove.isMoveStronger(false, strongCardsMove);

        expect(isStronger).to.equal(false);

    });

    it("isMoveStronger shall return true if given a set of cards that have higher strength, as argument and reverse is false",function(){
        
        var weakCardKind = chance.integer({min:3,max:6});
        var strongCardKind = chance.integer({min:7,max:14});

        var randWeakCardSuit = chance.integer({min:1,max:4});
        var randStrongCardSuit = chance.integer({min:1,max:4});

        var weakCards = [];
        var strongCards = [];

        for(var i = 0; i < 3; i++)
        {
            var weakCard = new Card(randWeakCardSuit, weakCardKind);
            var strongCard = new Card(randStrongCardSuit, strongCardKind);

            weakCards.push(weakCard);
            strongCards.push(strongCard);
        }

        var strongCardsMove = new PlayerMove(false,"asdfs",strongCards);
        var weakCardsMove = new PlayerMove(false,"asdfs",weakCards);

        var isStronger = weakCardsMove.isMoveStronger(true, strongCardsMove);

        expect(isStronger).to.equal(true);

    });




});
