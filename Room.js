
var Chance = require('chance').Chance();
var Player = require("./Player");
var colors = require('colors');
var Bot = require('../bot/Bot');
var jsonmaker = require('./JSONMaker');
var Constants = require('./Constants');
var Deck = require('./Deck');

function Room(seq, mode){

	var randomAlphabet = Chance.character({pool:'ABCDEFGHIJKLMNOPQRSTUVWYZ'});
    
    this._mode = mode;
	this._roomId = randomAlphabet + seq.toString();
	this._roundNum = 1;
	this._maxNumberOfPeople = 4;
	this._players = [];
    this._bots = [];
    this._deck = new Deck();
}

//  Public methods  //

Room.prototype.isRoomAvailable = function isRoomAvailable(){
	return this._players.length != this._maxNumberOfPeople;
}

Room.prototype.sendRoomDetails = function sendRoomDetails(connection,code){

    var details = {"round":this._roundNum, "roomId":this._roomId};
    var output = jsonmaker.makeResponseJSON(details,code);
    connection.sendUTF(JSON.stringify(output));

}

Room.prototype.sendPlayers = function sendPlayers(connection,code){

        
    if(this._mode == 1){

        // When singleplayer mode

        this.addBot(3);
        var bots = this._bots;

        var t = setInterval(function(){
            
            var item = bots.shift();

            var botDetail = {"userId":item.getUserId(),"photoId":item.getPhotoId()};
            var output = jsonmaker.makeResponseJSON(botDetail,code);
            connection.sendUTF(JSON.stringify(output));
            
            if(bots.length == 0){
                clearInterval(t);
            }

        },1000);

        sendRoomOccupiedMessage(connection,4000);        

        
    }else if(this._mode == 2){
    
        // When multiplayer mode
        

    }



}

Room.prototype.checkPlayerWithId = function checkPlayerWithId(userId){

	var filtered = this._players.filter(function(val){
				return val.getUserId() == userId
				});
	return filtered.length == 0;
}

Room.prototype.getRoomId = function getRoomId(){
    
    return this._roomId;

}


Room.prototype.addPlayer = function addPlayer(connection, code, avatarId){
	
	var newPlayer = new Player(avatarId);
	this._players.push(newPlayer);
	       
    console.log("-------------- add new user --------------".rainbow);

    var output = jsonmaker.makeResponseJSON({"userId":newPlayer.getUserId()},code);
    connection.sendUTF(JSON.stringify(output));

}

// end public methods


//  Private methods  //

Room.prototype.addBot = function addBot(numOfBots){

    for(var i = 0; i < numOfBots;i++){
        
        var selectedPhotoIds  = this._players.map(function(item){
            return item.getPhotoId();
        })

        var botPhotoIds = this._bots.map(function(item){
            return item.getPhotoId();
        })

    
        var bt = new Bot(selectedPhotoIds.concat(botPhotoIds));
        this._bots.push(bt);
    }
}

function sendRoomOccupiedMessage(connection, time){

    var g = setTimeout(function(){
         var occupiedOutput = jsonmaker.makeResponseJSON({},Constants.GAMEROOM_OCCUPIED);
         connection.sendUTF(JSON.stringify(occupiedOutput));
    },time);

}

// end private methods // 

module.exports = Room;
