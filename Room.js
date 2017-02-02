
var Chance = require('chance').Chance();
var Player = require("./Player");
var colors = require('colors');
var Bot = require('../bot/Bot');
var Constants = require('./Constants');
var Deck = require('./Deck');
var Message = require('./Message');
var MessageQueue = require('./MessageQueue');

function Room(seq, rules, mode){

	var randomAlphabet = Chance.character({pool:'ABCDEFGHIJKLMNOPQRSTUVWYZ'});
    
    this._rules = rules;
    this._mode = mode;
    this._state = 0;
    
	this._roomId = randomAlphabet + seq.toString();
	this._roundNum = 1;
	this._maxNumberOfPeople = 4;
	this._players = [];
    this._bots = [];
    this._playerReady = 0;
    this._deck = new Deck();
    this._playerIdWithTurn = undefined;
    this._firstDealt = true;
}

//  Public methods  //

Room.prototype.isRoomAvailable = function isRoomAvailable(){
	return this._players.length != this._maxNumberOfPeople;
}

Room.prototype.sendRoomDetails = function sendRoomDetails(connection,code){

    var details = {"round":this._roundNum, "roomId":this._roomId};
    MessageQueue.send(connection,[new Message(code,details)]);
}

Room.prototype.initialize = function initialize(connection){

	// Singleplayer mode
	
    if(this._mode == "0")
    {    
        this._state = 1;
        
        this.sendState(connection);
        this.addBot(connection, 3);  
    }
    else if(this._mode == 2){
    
        // When multiplayer mode
    }
}

Room.prototype.sendState = function sendState(conn)
{
	var data = {"state":this._state};
	var msg = new Message(Constants.STATE_CODE,data);
	
	MessageQueue.send(conn, [msg]);
}

Room.prototype.addBot = function addBot(conn, numOfBots){

    var players = this._players;
    var bots = this._bots;

    var timer = setInterval(function(){
        
        /* populate all photo Ids */

        var selectedPhotoIds  = players.map(function(item){
           return item.getPhotoId();
        })

        var botPhotoIds = bots.map(function(item){
           return item.getPhotoId();
        })
    
        var allPhotoIds = selectedPhotoIds.concat(botPhotoIds);

        /* end populate */

        var bt = new Bot(allPhotoIds);
        bots.push(bt);

        /* Send bot to clients */

        var msg = new Message(Constants.NEWPLAYER_CODE,
                {"userId":bt.getUserId(),"photoId":bt.getPhotoId()});
         
        MessageQueue.send(conn,[msg]);

        /* End Send Bot */        

        numOfBots--;

        if(numOfBots == 0)
        {
            clearInterval(timer);
        }

    },900);

}


Room.prototype.addReady = function addReady(){

    this._playerReady++;
    
    if(this._playerReady == this._players.length){

        var player = undefined;
        var index =  this._deck.getIndexStartCard();
        
        console.log("user with diamond 3, " + index.toString());

        if(index <= (this._players.length -1)){
            player = this._players[index];
        }else{
            player = this._bots[index-this._players.length];
        }

        player = this._players[0];

        this._players.forEach(function(item){
            var msg = new Message(Constants.STARTGAME_CODE,{});
            MessageQueue.send(item.getConn(), [msg]);
        });
                
         this._playerIdWithTurn = player.getUserId();       
     
    }

}

Room.prototype.getCards = function getCards(userId){

    this._players.forEach(function(item){
    
        if(item.getUserId() == userId){
            var card = item.getCard();
            var msg = new Message(Constants.CARD_CODE, {"cards":card[0]});
            MessageQueue.send(item.getConn(),[msg]);       
        }

    });
}

Room.prototype.checkPlayerWithId = function checkPlayerWithId(userId){

	var found = false;

    for(var i = 0;i<this._players.length;i++){
        found =this._players[i].getUserId() == userId;
    }

	return found;
}

Room.prototype.getRoomId = function getRoomId(){
    
    return this._roomId;

}


Room.prototype.addPlayer = function addPlayer(connection, avatarId){
	
	var newPlayer = new Player(avatarId,connection);
	       
    console.log("-------------- add new user --------------".rainbow);

    var id = newPlayer.getUserId();
    this._players.push(newPlayer);

    var msg = new Message(Constants.LOBBYDETAILS_CODE,{"userId":id});
    MessageQueue.send(connection,[msg]);
}



Room.prototype.addDealtCardsToPlayer = function addDealtCardsToPlayer(userId, data){

    var player = undefined;

    this._players.forEach(function(item){
        if(item.getUserId() == userId){
            item.addDealtCards(data);
            found = true;   
            player = item;
        }
    });
    
    
    /* send the dealt cards data to all player */
    
    var data = {"userId":player.getUserId(),"cards":player.getDealtCards()};

    this._players.forEach(function(item){
        var msg = new Message(Constants.DEALCARD_CODE,data);
        MessageQueue.send(item.getConn(),[msg]); 
    });
    
    this._firstDealt = false;
    
}

Room.prototype.switchTurn = function switchTurn(id){
	
	
	var turn = undefined;
	var turnPhotoId = undefined;
	var data = undefined;
	
	
	var indexCurrPlayer = getIndexForId(this._playerIdWithTurn,this._players);
	var player = undefined;
	var nextIndex = undefined;



	if(this._firstDealt){
		
		player = getPlayerForIndex(indexCurrPlayer,this._players,this._bots);
		
		
	}else{
		
		if(indexCurrPlayer == 0){
			
			nextIndex = 3;
			
		}else if(indexCurrPlayer == 1){
			
			nextIndex = 2;
			
		}else if(indexCurrPlayer == 2){
			
			nextIndex = 0;
			
		}else if(indexCurrPlayer == 3){
			
			nextIndex = 1;
			
		}
		
		
		player = getPlayerForIndex(nextIndex,this._players,this._bots);
		
	}
	
	
	turn = player.getUserId();
	turnPhotoId = player.getPhotoId();

	
	if(this._firstDealt){
		
		data =  {"turn":turn,"photoId":turnPhotoId};
		
	}else{
		
		data = {"turn":turn,"photoId":turnPhotoId,
		"prevTurnId":this._playerIdWithTurn};
		
		this._playerIdWithTurn = player.getUserId();
		
	}
	

	this._players.forEach(function(item){
        var msg = new Message(Constants.MOVE_CODE, data);
        MessageQueue.send(item.getConn(),[msg]); 
    });

    
	
}

Room.prototype.getNumberOfPlayers = function getNumberOfPlayers(){

    return this._players.length;
    
}


// end public methods



//  Private methods  //


function getIndexForId(id,players){
	
	var idx = undefined;
	
	players.forEach(function(item,index){
		
		if(item.getUserId() == id){

			idx = index;
			
		}
		
	});
	
	return idx;
}


function getPlayerForIndex(index, players, bots){
	
	var player = undefined
	
	if(index <= (players.length -1)){
		player = players[index];
    }else{
		player = bots[index-players.length];
    }
	
	return player;
}







Room.prototype.manageCards = function manageCards(){

    this._deck.shuffle();
    var cards = this._deck.getCards();
    var counter = 0;

    this._players.forEach(function(item,index){
        item.addCard(cards[index]);
        counter = index;
    });

    counter++;

    this._bots.forEach(function(item){
        item.addCard(cards[counter++]);
    });
}





function sendRoomOccupiedMessage(connection, time){

    var g = setTimeout(function(){
         var occupiedOutput = jsonmaker.makeResponseJSON({},Constants.GAMEROOM_OCCUPIED);
         connection.send(JSON.stringify(occupiedOutput));
    },time);

}

// end private methods // 

module.exports = Room;
