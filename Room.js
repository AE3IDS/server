
var Chance = require('chance').Chance();
var Player = require("./Player");
var colors = require('colors');
var Bot = require('../bot/Bot');
var jsonmaker = require('./JSONMaker');


function Room(seq, mode){

	var randomAlphabet = Chance.character({pool:'ABCDEFGHIJKLMNOPQRSTUVWYZ'});
    
    this._mode = mode;
	this._roomId = randomAlphabet + seq.toString();
	this._roundNum = 1;
	this._maxNumberOfPeople = 4;
	this._players = [];
    this._bots = [];
}

//  Public methods  //

Room.prototype.isRoomAvailable = function isRoomAvailable(){
	return this._players.length != this._maxNumberOfPeople;
}

Room.prototype.sendRoomDetails = function sendRoomDetails(connection,code){

    var details = {"round":this._roundNum, "roomId":this._roomId};
    var output = jsonmaker.makeGreetJSON(details,code);
    connection.sendUTF(JSON.stringify(output));

}

Room.prototype.sendPlayers = function sendPlayers(connection,code){

        
    if(this._mode == 1){

        // When singleplayer mode

        this.addBot(3);
        this._bots.forEach(function(item){
            var botDetail = {"userId":item.getUserId(),"photoId":item.getPhotoId()};
            var output = jsonmaker.makeNewPlayerJSON(botDetail,code);
            connection.sendUTF(JSON.stringify(output));
        }


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


Room.prototype.addPlayer = function addPlayer(avatarId){
	
       
	var newPlayer = new Player(avatarId);
	this._players.push(newPlayer);
	
       
    console.log("-------------- add new user --------------".rainbow);

    /*console.log("photo id of player is " + newPlayer.getPhotoId());
	console.log("user id of player is " + newPlayer.getUserId());

    console.log("------------------------------------------".rainbow);*/

	return newPlayer.getUserId();
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

// end private methods // 

module.exports = Room;
