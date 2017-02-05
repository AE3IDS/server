
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

Room.prototype.getNumberOfPlayers = function getNumberOfPlayers()
{
    return this._players.length;
}

Room.prototype.getRoomId = function getRoomId()
{
    return this._roomId;
}

Room.prototype.checkPlayerWithId = function checkPlayerWithId(userId){

    var players = this._players.filter(function(item){
    	return (item.getUserId() == userId);
    })

	return (players.length != 0);
}


/* ==================================================== */

				/* Code Handlers */

/* ==================================================== */


Room.prototype.requestPlayers = function requestPlayers(connection,userId){

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



Room.prototype.addBot = function addBot(conn, numOfBots){

    var players = this._players;
    var bots = this._bots;

    while(numOfBots != 0)
    {
    	 var selectedPhotoIds  = players.map(function(item){
           return item.getPhotoId();
        })

        var botPhotoIds = bots.map(function(item){
           return item.getPhotoId();
        })
    
        var allPhotoIds = selectedPhotoIds.concat(botPhotoIds);

        /* end populate */

        var bt = new Bot(allPhotoIds);
       	this._bots.push(bt);       

        numOfBots--;
    }

    /* Send bot to clients */

	var data = this._bots.map(function(item){
		return {"userId":item.getUserId(),"photoId":item.getPhotoId()}
	});

	var msg = new Message(Constants.NEWPLAYER_CODE,data);     
    MessageQueue.send(conn,[msg]);
        
    // e.emit('avatar');	
}

/* ==================================================== */

			/* Turn switching feature */

/* ==================================================== */


Room.prototype.firstDealtTurn = function firstDealtTurn (){

    var index =  this._deck.getIndexStartCard();
 	var player = getPlayerForIndex(index, this._players, this._bots);

     player = this._players[0]; 

     return player;       
}

Room.prototype.switchTurn = function switchTurn(id){
	
	var indexCurrPlayer = getIndexForId(id,this._players);
	var nextIndex = undefined;


	if(indexCurrPlayer == 0){
		
		nextIndex = 2;
		
	}else if(indexCurrPlayer == 1){
		
		nextIndex = 0;
		
	}else if(indexCurrPlayer == 2){
		
		nextIndex = 3;

	}else if(indexCurrPlayer == 3){

		nextIndex = 1;

	}


	var player = getPlayerForIndex(nextIndex,this._players,this._bots);

	return player;
}


Room.prototype.getTurn = function getTurn(conn, userId)
{
	var playerWithTurn = undefined;
	var data = undefined;

	if(this._firstDealt)
	{
		this._state = 4;
		playerWithTurn = this.firstDealtTurn();

		data = {"userId":playerWithTurn.getUserId(),
    			"photoId":playerWithTurn.getPhotoId()}

		this._firstDealt = false;
		this.sendState(conn);
	}
	else
	{
		playerWithTurn = this.switchTurn(userId);
		data = {"userId":playerWithTurn.getUserId(),
    			"photoId":playerWithTurn.getPhotoId(),
    			"prevTurnId":userId}

	}


    this._players.forEach(function(item){
    	var msg = new Message(Constants.TURN_CODE,data);
    	MessageQueue.send(item.getConn(), [msg]);
	});

}


/* ==================================================== */


Room.prototype.addPlayerMove = function addPlayerMove(userId, data){

    var players = this._players.filter(function(item){
    	return (item.getUserId() == userId);
    })

    var player = players.pop();
    player.addDealtCards(data);

    var data = {"userId":player.getUserId(),"cards":player.getDealtCards()};

    this.sendToAll(Constants.MOVE_CODE, data);
}


Room.prototype.passTurnHandler = function passTurnHandler(userId){

    var passPlayer = this._players.filter(function(item){
    	return (item.getUserId() == userId);
    })
    
    var player = passPlayer.pop();    
    var data = {"userId":player.getUserId(),"photoId":player.getPhotoId()};

    this.sendToAll(Constants.PASSTURN_CODE,data)
}


Room.prototype.addPlayer = function addPlayer(connection, avatarId){
	
	var newPlayer = new Player(avatarId,connection);
	       
    console.log("-------------- add new user --------------");

    var id = newPlayer.getUserId();
    this._players.push(newPlayer);

    var msg = new Message(Constants.LOBBYDETAILS_CODE,{"userId":id});
    MessageQueue.send(connection,[msg]);
}



Room.prototype.requestCards = function requestCards(conn, userId){


	this._state = 2;
	this.sendState(conn);
	this.manageCards();

	var g = [this._players,this._bots];
	
	g.forEach(function(item)
	{	
		item.forEach(function(i)
		{
			var card = i.getCard();
			var data = undefined;

			if(i.getUserId() == userId)
			{
				data = {"cards":card};	
			}
			else
			{
				data = {"cards":card.length};
			}

			data["userId"] = i.getUserId();
			
			var msg = new Message(Constants.CARD_CODE,data);
			MessageQueue.send(conn,[msg]); 
		})
	})

}








// end public methods



/* ==================================================== */

				/* Private methods */

/* ==================================================== */


Room.prototype.sendState = function sendState()
{
	var data = {"state":this._state}
	this.sendToAll(Constants.STATE_CODE,data);
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


Room.prototype.sendToAll = function sendToAll(code, data)
{
	this._players.forEach(function(item){
        var msg = new Message(code,data);
        MessageQueue.send(item.getConn(),[msg]); 
    });
}


function getIndexForId(id,players){
	
	var idx = undefined;

	players.forEach(function(item,index){
		
		if(item.getUserId() == id)
			idx = index;
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



// end private methods // 

module.exports = Room;
