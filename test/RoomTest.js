var chai = require('chai');
var expect = chai.expect;
var Room = require('../Room');
var chance = require('chance').Chance();
var Player = require('../Player');

describe('RoomTest',function(){
    
    /*it("photoId of each player should be unique",function(){
        var room = new Room(1);
        room.addPlayer(chance.natural({min:0,max:5}));
        room.addBot(3);

      
        var players = room._players.concat(room._bots);

        for(var i =0 ;i < players.length;i++){
            for(var j = i+1; j < players.length;j++){
                if(players[i] == players[j]){
                    error = true;
                }
            }
        }
        
        console.log(players)
        var error = false;
        expect(error).to.equal(false);
    });*/

   
});
