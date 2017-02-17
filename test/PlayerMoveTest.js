var chai = require('chai');
var expect = chai.expect;
var Eight = require('../rules/EightEndersRule');
var Jack = require('../rules/JackBack');
var Jokers = require('../rules/JokersAreWild');
var Revolution = require('../rules/Revolution');
var PlayerMove = require('../PlayerMove');
var GeneralRule = require('../rules/GeneralRule');
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


    /* checkExtraRules test */

    // it("checkExtraRules shall return undefined if there are no rules that are applicable for an array of cards that doesnt satisfy any rules",function(){

    //     /* initialize rules */

    //     var general = new GeneralRule();
    //     var jackRule = new Jack();
    //     var revolution = new Revolution();
    //     var eightRule = new Eight();
    //     var jokerRule = new Jokers();

    //     var rules = [general, jackRule, revolution, eightRule, jokerRule];


    //      // Input: array of 3 Card items with card rank/kind 3 
        
    //     var cards = [];

    //     for(var i = 0; i < 3; i++)
    //     {
    //         var randSuit = chance.natural({min:1,max:4});
    //         var newCard = new Card(randSuit, 3);
    //         cards.push(newCard);
    //     }

    //     var plMove = new PlayerMove(undefined, undefined, cards);

    //     var output = plMove.checkExtraRules(rules);

    //     expect(output == undefined).to.equal(true);
    // });

    // it("checkExtraRules shall return an object with the 'now' property that only has 'Jack back', if applicabale rules are jack back without any Eight Enders"
    //     ,function(){

    //     /* initialize rules */

    //     var general = new GeneralRule();
    //     var jackRule = new Jack();
    //     var revolution = new Revolution();
    //     var eightRule = new Eight();
    //     var jokerRule = new Jokers();

    //     var rules = [general, jackRule, revolution, eightRule, jokerRule];


    //     /* Input: array of 3 Card items with card rank/kind 11 */
        
    //     var cards = [];

    //     for(var i = 0; i < 3; i++)
    //     {
    //         var randSuit = chance.natural({min:1,max:4});
    //         var newCard = new Card(randSuit,11);
    //         cards.push(newCard);
    //     }

    //     var plMove = new PlayerMove(undefined, undefined, cards);

    //     var output = plMove.checkExtraRules(rules);

    //     var nowProperty = output["now"];

    //     expect(nowProperty != undefined).to.equal(true);
    //     expect(nowProperty.length == 1).to.equal(true);
    //     expect(nowProperty.pop() == "Jack Back").to.equal(true);
    // });

    // it("checkExtraRules shall return an object with the newRound property that has false value, if applicabale rules are jack back without any Eight Enders"
    //     ,function(){

    //     /* initialize rules */

    //     var general = new GeneralRule();
    //     var jackRule = new Jack();
    //     var revolution = new Revolution();
    //     var eightRule = new Eight();
    //     var jokerRule = new Jokers();

    //     var rules = [general, jackRule, revolution, eightRule, jokerRule];


    //     /* Input: array of 3 Card items with card rank/kind 11 */
        
    //     var cards = [];

    //     for(var i = 0; i < 3; i++)
    //     {
    //         var randSuit = chance.natural({min:1,max:4});
    //         var newCard = new Card(randSuit,11);
    //         cards.push(newCard);
    //     }

    //     var plMove = new PlayerMove(undefined, undefined, cards);

    //     var output = plMove.checkExtraRules(rules);

    //     var nowProperty = output["newRound"];

    //     expect(nowProperty != undefined).to.equal(true);
    //     expect(nowProperty == false).to.equal(true);
    // });

    // it("checkExtraRules shall return an object with the newRound property that has true value, if applicabale rules are Eight Enders followed by Revolution"
    //     ,function(){

    //     /* initialize rules */

    //     var general = new GeneralRule();
    //     var jackRule = new Jack();
    //     var revolution = new Revolution();
    //     var eightRule = new Eight();
    //     var jokerRule = new Jokers();

    //     var rules = [general, jackRule, revolution, eightRule, jokerRule];


    //     /* Input: array of 4 Card items with card rank/kind 8 */
        
    //     var cards = [];

    //     for(var i = 0; i < 4; i++)
    //     {
    //         var randSuit = chance.natural({min:1,max:4});
    //         var newCard = new Card(randSuit,8);
    //         cards.push(newCard);
    //     }

    //     var plMove = new PlayerMove(undefined, undefined, cards);

    //     var output = plMove.checkExtraRules(rules);

    //     var nowProperty = output["newRound"];

    //     expect(nowProperty != undefined).to.equal(true);
    //     expect(nowProperty == true).to.equal(true);
    // });

    // it("checkExtraRules shall return an object with the 'now' property that only has 'Eight Enders', if applicabale rules are Eight Enders followed by Revolution"
    //     ,function(){

    //     /* initialize rules */

    //     var general = new GeneralRule();
    //     var jackRule = new Jack();
    //     var revolution = new Revolution();
    //     var eightRule = new Eight();
    //     var jokerRule = new Jokers();

    //     var rules = [general, jackRule, revolution, eightRule, jokerRule];


    //      // Input: array of 4 Card items with card rank/kind 8 
        
    //     var cards = [];

    //     for(var i = 0; i < 4; i++)
    //     {
    //         var randSuit = chance.natural({min:1,max:4});
    //         var newCard = new Card(randSuit,8);
    //         cards.push(newCard);
    //     }

    //     var plMove = new PlayerMove(undefined, undefined, cards);

    //     var output = plMove.checkExtraRules(rules);

    //     var nowProperty = output["now"];

    //     expect(nowProperty != undefined).to.equal(true);
    //     expect(nowProperty.length == 1).to.equal(true);
    //     expect(nowProperty.pop() == "Eight Enders").to.equal(true);
    // });

    // it("checkExtraRules shall return an object with the 'later' property that only has 'Revolution', if applicabale rules are Eight Enders followed by Revolution"
    //     ,function(){

    //     /* initialize rules */

    //     var general = new GeneralRule();
    //     var jackRule = new Jack();
    //     var revolution = new Revolution();
    //     var eightRule = new Eight();
    //     var jokerRule = new Jokers();

    //     var rules = [general, jackRule, revolution, eightRule, jokerRule];


    //      // Input: array of 4 Card items with card rank/kind 8 
        
    //     var cards = [];

    //     for(var i = 0; i < 4; i++)
    //     {
    //         var randSuit = chance.natural({min:1,max:4});
    //         var newCard = new Card(randSuit,8);
    //         cards.push(newCard);
    //     }

    //     var plMove = new PlayerMove(undefined, undefined, cards);

    //     var output = plMove.checkExtraRules(rules);

    //     var nowProperty = output["later"];

    //     expect(nowProperty != undefined).to.equal(true);
    //     expect(nowProperty.length == 1).to.equal(true);
    //     expect(nowProperty.pop() == "Revolution").to.equal(true);
    // });

    it("isMoveEqualTo shall return true when two PlayerMove object is the same",function(){
        
        var cards = [];
        var randNumOfCards = chance.integer({min:1,max:13});

        for(var i = 0; i < randNumOfCards; i++)
        {
            var randSuit = chance.natural({min:1,max:4});
            var randKind = chance.natural({min:3,max:15});

            var newCard = new Card(randSuit,randKind);
            cards.push(newCard);
        }

        var plMove1 = new PlayerMove(true, "asdfs", cards);
        var plMove2 = new PlayerMove(true, "asdfs", cards);

        var isEqual = plMove1.isMoveEqualTo(plMove2);

        expect(isEqual).to.equal(true);
    });

    it("isMoveEqualTo shall return false when two PlayerMove object is the different",function(){
        

        // Player Move object 1

        var cards = [];
        var randNumOfCards = chance.integer({min:1,max:13});

        for(var i = 0; i < randNumOfCards; i++)
        {
            var randSuit = chance.natural({min:1,max:4});
            var randKind = chance.natural({min:3,max:15});

            var newCard = new Card(randSuit,randKind);
            cards.push(newCard);
        }

        var plMove1 = new PlayerMove(true, "asdfs", cards);



        // Player Move object 2

        var cards2 = [];

        for(var i = 0; i < randNumOfCards; i++)
        {
            var randSuit = chance.natural({min:1,max:4});
            var randKind = chance.natural({min:3,max:15});

            var newCard = new Card(randSuit,randKind);
            cards2.push(newCard);
        }

        var plMove2 = new PlayerMove(true, "qwerty", cards2);

        var isEqual = plMove1.isMoveEqualTo(plMove2);

        expect(isEqual).to.equal(false);
    });






});
