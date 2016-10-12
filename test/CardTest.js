var chai = require('chai');
var expect = chai.expect;
var Card = require('../Card');

describe("CardTest",function(){
    
    it("isCardEqual shall return true if compared against a same card",function(){
    
        var c = new Card(0,5);
        var m = new Card(0,5);

        expect(c.isCardEqual(m)).to.equal(true);
    });

    it("isCardStronger shall return true if compared a card that has lower strength",function(){

        var c = new Card(0,5);
        var g = new Card(2,10);

        expect(g.isCardStronger(c)).to.equal(true);

    });

})
