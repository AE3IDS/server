
var Chance = require('chance').Chance();
var Player = require("./Player");
var colors = require('colors');
var Bot = require('../bot/Bot');
var Constants = require('./Constants');
var Deck = require('./Deck');
var Message = require('./Message');
var MessageQueue = require('./MessageQueue');
var Round = require('./Round');

function Room(seq, rules, mode){

	var randomAlphabet = Chance.character({pool:'ABCDEFGHIJKLMNOPQRSTUVWYZ'});
    
    this._rules = rules;
    this._mode = mode;
    this._state = 0;
    
	// this._roomId = randomAlphabet + seq.toString();
	this._roomId = "R1";
	this._roundNum = 1;
	this._maxNumberOfPeople = 2;

	this._round = new Round(this._rules,this._maxNumberOfPeople-1);

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
    else if(this._mode == "1")
    {
    	this.multiplayer(connection);    
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

/* ============================================================= */

				/* Turn switching feature */

/* ============================================================= */


Room.prototype.getFirstTurn = function getFirstTurn(conn, userId)
{
	this._state = 4;
	this.sendState(conn);

	var index =  this._deck.getIndexStartCard();
	var playerWithTurn = getPlayerForIndex(index, this._players, this._bots);

	playerWithTurn = this._players[0];

	var data = {"userId":playerWithTurn.getUserId(),
			"photoId":playerWithTurn.getPhotoId()}

	this.sendTo(conn,Constants.TURN_CODE,data);
}

/* ============= Helper Function for Turn-switching ============= */


Room.prototype.switchTurn = function switchTurn(id){
	
	var indexCurrPlayer = getIndexForId(id,this._players);
	var nextIndex = undefined;


	if(indexCurrPlayer == 0){
		
		nextIndex = 1;
		
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

Room.prototype.getNextTurn = function getNextTurn(userId)
{
	var	playerWithTurn = this.switchTurn(userId);

	if(this._round.checkIfReturn(playerWithTurn.getUserId()))
	{
		var data1 = {"userId":playerWithTurn.getUserId()};
		this.sendTo(playerWithTurn.getConn(),Constants.DELETEDEALT_CODE,data1)
		console.log("return");
	}

	var data = {"userId":playerWithTurn.getUserId(),
			"photoId":playerWithTurn.getPhotoId(),
			"prevTurnId":userId}

	return data;
}

Room.prototype.helper = function helper(userId, func)
{
	var nextTurnData = this.getNextTurn(userId);
    	
	// send previous turn data

	var prevTurn = {"prevTurnId":nextTurnData["prevTurnId"]};
	this.sendToAll(Constants.TURN_CODE,prevTurn);	

	var _this = this;

	setTimeout(function()
	{
		var nextTurnHandler = function(data, time){

			var timeoutSendTime = (time == undefined)?2700:time;

			var sendFunction = function(){

 				delete data["prevTurnId"];
 				_this.sendToAll(Constants.TURN_CODE,data);

 			}

			setTimeout(sendFunction,timeoutSendTime);
		}


		func(_this, nextTurnData, nextTurnHandler);

	},720)
}

/* ================= End Helper Function ================ */


Room.prototype.addPlayerMove = function addPlayerMove(userId, data)
{
    var player = this.getPlayerWithId(userId);

    player.removeCards();
   	player.addDealtCards(data);

   	this._round.initializeMove(false,userId,player.getDealtCards())
    var status = this._round.addMove();

    if(status)
    {
    	this.helper(userId, function(elem, nextTurndata, func)
    	{
    		var data = {"userId":player.getUserId(),
    					"cards":player.getDealtCards()};

    		elem.sendToAll(Constants.MOVE_CODE, data);
    		func(nextTurndata);
    	});
    }
    else
    {
  	 	this.sendTo(player.getConn(), Constants.INVALIDMOVE_CODE, {});
    } 
}

Room.prototype.passTurnHandler = function passTurnHandler(userId)
{
    var player = this.getPlayerWithId(userId); 

    this._round.initializeMove(true, userId, undefined);
    this._round.addMove();

    var func = undefined;

    if(this._round.hasPassedMax())
    {
    	func = function(elem, nextTurnData, func)
    	{
    		var data = {"userId":nextTurnData["userId"],
    					"photoId":nextTurnData["photoId"]};

    		elem.sendToAll(Constants.ROUNDWIN_CODE,data)


    		var sendNewRound = function(){
    			elem.sendToAll(Constants.NEWROUND_CODE,{});
    		}

    		elem._round.reset();
    		setTimeout(sendNewRound,2500);
    		func(nextTurnData, 5200);
    	}
    }
    else
    {
    	func = function(elem, nextTurnData, func)
    	{
    		var data = {"userId":player.getUserId(),
    					"photoId":player.getPhotoId()};

			elem.sendToAll(Constants.PASSTURN_CODE,data);

			func(nextTurnData);
    	}
    }

	this.helper(userId, func);
}


/* ============================================================= */

				/* End Turn switching feature */

/* ============================================================= */


Room.prototype.addPlayer = function addPlayer(connection, avatarId){
	
	var newPlayer = new Player(avatarId,connection);
	       
    console.log("-------------- add new user --------------");

    var id = newPlayer.getUserId();
    this._players.push(newPlayer);

    var msg = new Message(Constants.LOBBYDETAILS_CODE,{"userId":id});
    MessageQueue.send(connection,[msg]);
}



Room.prototype.requestCards = function requestCards(){

	this._state = 2;
	this.sendState();
	this.manageCards();

	var players = this._players;
	var bots = this._bots;
	var _this = this;

	players.forEach(function(i)
	{
		var otherPlayers = players.filter(function(item){
			return (i.getUserId() != item.getUserId())
		});

		otherPlayers = otherPlayers.concat(bots);

		otherPlayers.forEach(function(h){
			var data = {"cards":h.getCard().length, "userId":h.getUserId()};
			_this.sendTo(i.getConn(), Constants.CARD_CODE, data);
		});

		var playerCard = i.getCard();
		var data = {"cards":playerCard,"userId":i.getUserId()};
		_this.sendTo(i.getConn(), Constants.CARD_CODE, data)
	})


}

// end public methods



/* ==================================================== */

				/* Private methods */

/* ==================================================== */


Room.prototype.getPlayerWithId = function getPlayerWithId(userId)
{
	var playerIndex = getIndexForId(userId, this._players);
	return this._players[playerIndex];
}


Room.prototype.multiplayer = function multiplayer(conn)
{
	var sliced = this._players.slice(0,this._players.length-1);
	var added = this._players[this._players.length-1];

	var _this = this;

	sliced.forEach(function(item)
	{
		var existPlayer = [{"userId":item.getUserId(),"photoId":item.getPhotoId()}];
		_this.sendTo(conn,Constants.NEWPLAYER_CODE,existPlayer);

		var playerAdded = [{"userId":added.getUserId(),"photoId":added.getPhotoId()}];
		_this.sendTo(item.getConn(),Constants.NEWPLAYER_CODE,playerAdded)
	});

	if(this._players.length == 2)
	{
		this.requestCards();
	}
	else
	{
		this._state = 3;
		this.sendState();
	}
}


Room.prototype.sendState = function sendState(conn)
{
	var data = {"state":this._state}
	
	if(conn == undefined)
	{
		this.sendToAll(Constants.STATE_CODE,data);
	}
	else
	{
		this.sendTo(conn,Constants.STATE_CODE,data);
	}
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


Room.prototype.sendTo = function sendTo(conn, code, data)
{
	var msg = new Message(code,data);
    MessageQueue.send(conn,[msg]); 
}


Room.prototype.sendToAll = function sendToAll(code, data)
{
	this._players.forEach(function(item){
        var msg = new Message(code,data);
        MessageQueue.send(item.getConn(),[msg]); 
    });
}


function getIndexForId(id,players){
	
	var idx = -1;

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
