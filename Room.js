
var Chance = require('chance').Chance();
var Player = require("./Player");
var colors = require('colors');
// var Bot = require('../bot/Bot');
var Constants = require('./Constants');
var Deck = require('./Deck');
var Message = require('./Message');
var MessageQueue = require('./MessageQueue');
var Round = require('./Round');
var BotSpawner = require('./BotSpawner');
var MessageSeq = require('./MessageSeq');


const BOT_MODE = "0";
const PLAYER_MODE = "1";
const ROOMCREATOR_INDEX = 0;


function Room(seq, rules, mode){

	var randomAlphabet = Chance.character({pool:'ABCDEFGHIJKLMNOPQRSTUVWYZ'});
    
    this._rules = rules;
    this._mode = mode;
    this._state = 0;
    
	// this._roomId = randomAlphabet + seq.toString();
	this._roomId = "R1";
	this._roundNum = 1;
	this._maxNumberOfPeople = 2;
	this._hasSpawnBots = false;

	this._round = new Round(this._rules,this._maxNumberOfPeople-1);

	this._players = [];
    this._bots = [];
    this._playerReady = 0;
    this._deck = new Deck();
    this._playerIdWithTurn = undefined;
    this._firstDealt = true;
    this._message = [];

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

Room.prototype.requestAvatars = function requestAvatars(conn)
{
	var photoIds = this._players.map(function(item){
		return item.getPhotoId();
	});

	this.sendTo(conn, Constants.REQUESTAVATARS_CODE, photoIds);
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

Room.prototype.getRoomRules = function getRoomRules(conn)
{

	var ruleId = this._rules.map(function(item){
		return item.getId();
	})

	this.sendTo(conn, Constants.BOTRULES_LIST, {"rules":ruleId})

}


Room.prototype.requestPlayers = function requestPlayers(connection,userId)
{

    this.multiplayer(connection, 2, userId);

    if(this._mode == BOT_MODE && !this._hasSpawnBots)
    {
    	BotSpawner(this._roomId,1);
        this._hasSpawnBots = true;
    }

}


/* ============================================================= */

				/* Turn switching feature */

/* ============================================================= */


Room.prototype.getFirstTurn = function getFirstTurn(conn, userId)
{
	this._state = 4;
	this.sendState(conn);

	var isRoomOwner = this._players[ROOMCREATOR_INDEX].getUserId() == userId;

	if(isRoomOwner)
	{
		var index =  this._deck.getIndexStartCard();
		var playerWithTurn = getPlayerForIndex(index, this._players, this._bots);

		playerWithTurn = this._players[0];

		var data = this.returnPlayerDetails(playerWithTurn);
		this.sendToAll(Constants.TURN_CODE,data);
	}

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


Room.prototype.removePlayerCards = function removePlayerCards(targetPlayer, numOfCards)
{
	targetPlayer.remove(numOfCards);

	return (targetPlayer.getCardCount() == 0);

}


Room.prototype.requestMessage = function requestMessage(userId)
{
	if(this._message.length != 0)
	{
		if(this._message[0].isOwner(userId))
		{
			var mes = this._message.shift();
			mes.execute();			
		}
	}
}


Room.prototype.getNextTurn = function getNextTurn(userId)
{

	var _this = this;
	var	playerWithTurn = this.switchTurn(userId);


	/* Send DELETEDEALT_CODE if return to player */

	if(this._round.checkIfReturn(playerWithTurn.getUserId()))
	{
		var s = new MessageSeq(500, userId, function()
		{
			var data1 = {"userId":playerWithTurn.getUserId(),
						 "caller":userId};

			_this.sendToAll(Constants.DELETEDEALT_CODE,data1)
		});

		this._message.push(s);

		console.log("return");
	}


	/* send player details of next turn */

	var nextTurnData = this.returnPlayerDetails(playerWithTurn);

	var s = new MessageSeq(900, userId, function()
	{
		_this.sendToAll(Constants.TURN_CODE,nextTurnData);
	});

	this._message.push(s);

}



/* ================= End Helper Function ================ */


Room.prototype.addPlayerMove = function addPlayerMove(userId, data)
{
    var player = this.getPlayerWithId(userId);

    player.clearDealt();
   	player.addDealtCards(data);

   	var hasExtraRules = this._round.checkMoveExtra(player.getDealtCards());
    var status = this._round.addMove(false,userId,player.getDealtCards());

    var _this = this;


    if(status)
    {
    	this.sendPrevTurn(userId);


    	/* Send the cards of the move */

		this.sendMoveCards(userId, player);


		/* Send rules */

		if(hasExtraRules)
		{
			this.handleNowRules(userId);
		}

		this.getNextTurn(userId);
    }
    else
    {
  	 	this.sendTo(player.getConn(), Constants.INVALIDMOVE_CODE, {});
    } 
}


Room.prototype.sendPrevTurn = function sendPrevTurn(userId)
{
	var _this = this;

	var prevTurn = function()
    {
    	var prevTurn = {"prevTurnId":userId};
		_this.sendToAll(Constants.TURN_CODE,prevTurn);	
    }
    		
   setTimeout(prevTurn, 400);
}


Room.prototype.sendMoveCards = function sendMoveCards(userId, player)
{
	var _this = this;

	var move = new MessageSeq(700, userId, function(){

    	var data = _this.returnPlayerDetails(player);
    	data["cards"] = player.getDealtCards();

    	_this.sendToAll(Constants.MOVE_CODE, data);
	})

	this._message.push(move);
}


Room.prototype.handleNowRules = function handleNowRules(userId)
{
	var rules = this._round.getNowRules();
	var _this = this;

	rules.forEach(function(item){

		var rule = new MessageSeq(1300, userId, function()
		{
			_this.sendToAll(Constants.RULES_LIST, item);
		})

		_this._message.push(rule);

	})


	if(this._round.willStartNewRound())
	{
		var m = new MessageSeq(1000, userId, function()
		{
			_this.sendToAll(Constants.NEWROUND_CODE,{});
			_this._round.reset();
		})

		_this._message.push(m);
	}
}


Room.prototype.passTurnHandler = function passTurnHandler(userId)
{
    var player = this.getPlayerWithId(userId); 

    this._round.addMove(true,userId,undefined);

    var func = undefined;


    if(this._round.hasPassedMax())
    {
    	func = function(elem, nextTurnData, func)
    	{
    		var data = {"userId":nextTurnData["userId"],
    					"photoId":nextTurnData["photoId"]};

    		elem.sendToAll(Constants.ROUNDWIN_CODE,data)
    		elem.sendNewRound(2500);

    		func(nextTurnData, 5200);
    	}
    }
    else
    {
       func = function(elem, nextTurnData, func)
       {
            	var data = elem.returnPlayerDetails(player);
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

		otherPlayers.forEach(function(h){

			var data = _this.returnPlayerDetails(h);
			data["cards"] = h.getCard().length;

			_this.sendTo(i.getConn(), Constants.CARD_CODE, data);

		});

		var data = _this.returnPlayerDetails(i);
		data["cards"] = i.getCard();

		_this.sendTo(i.getConn(), Constants.CARD_CODE, data)
	})


}

// end public methods



/* ==================================================== */

				/* Private methods */

/* ==================================================== */

Room.prototype.returnPlayerDetails = function returnPlayerDetails(player)
{
	return {"userId":player.getUserId(),"photoId":player.getPhotoId()};
} 


Room.prototype.sendNewRound = function sendNewRound(time)
{
	var _this = this;

	setTimeout(function(){
		_this.sendToAll(Constants.NEWROUND_CODE,{});
   		_this._round.reset();
	},time)

}


Room.prototype.getPlayerWithId = function getPlayerWithId(userId)
{
	var playerIndex = getIndexForId(userId, this._players);
	return this._players[playerIndex];
}


Room.prototype.multiplayer = function multiplayer(conn, maxNumOfPeople, userId)
{

	var isLastPlayer = false;

	if(this._players.length > 1)
	{
		var Ids = this._players.map(function(item){
			return item.getUserId();
		})

		var idIndex = Ids.indexOf(userId);

		isLastPlayer = idIndex == maxNumOfPeople -1;

		var sliced = this._players.slice(0,idIndex);
		var added = this._players[idIndex];

		var _this = this;

		sliced.forEach(function(item)
		{
			var existPlayer = _this.returnPlayerDetails(item);
			_this.sendTo(conn,Constants.NEWPLAYER_CODE,[existPlayer]);

			var playerAdded = _this.returnPlayerDetails(added);
			_this.sendTo(item.getConn(),Constants.NEWPLAYER_CODE,[playerAdded])
		});
	}

	if(isLastPlayer)
	{
		this.requestCards();
	}
	else
	{
    	this._state = (this._mode == BOT_MODE) ? 1 : 3;
    	this.sendState(conn);
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
