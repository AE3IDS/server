var chai = require('chai');
var expect = chai.expect;
var Room = require('../Room');
var chance = require('chance').Chance();

describe('RoomTest',function(){
    
    it("photoId of each player should be unique",function(){
        var room = new Room(1);
        room.addPlayer(chance.natural({min:0,max:5}));
        room.addBot();
        room.addBot();
        room.addBot();

        var error = false;

        var players = room._players.concat(room._bots);

        for(var i =0 ;i < players.length;i++){
            for(var j = i+1; j < players.length;j++){
                if(players[i] == players[j]){
                    error = true;
                }
            }
        }
        console.log(players);
        expect(error).to.equal(false);
    });


});
