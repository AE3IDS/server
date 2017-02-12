
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


Room.prototype.requestPlayers = function requestPlayers(connection,userId)
{

    this.multiplayer(connection, 4, userId);

    if(this._mode == BOT_MODE && !this._hasSpawnBots)
    {
    	BotSpawner(this._roomId,3);
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

		 data = {"userId":playerWithTurn.getUserId(),
			"photoId":playerWithTurn.getPhotoId()}

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

   	var extraRules = this._round.checkMoveExtra(player.getDealtCards());
    var status = this._round.addMove(false,userId,player.getDealtCards());
    
    console.log(extraRules);

    if(status)
    {
    	this.helper(userId, function(elem, nextTurndata, func)
    	{
    		/* Send the cards of the move */

    		var data = {"userId":player.getUserId(),
    					"cards":player.getDealtCards()};

    		elem.sendToAll(Constants.MOVE_CODE, data);


    		/* Send extra rules that apply */

    		var sendNextTurnTime = undefined;

    		if(extraRules)
    		{
    			var e = extraRules["now"];

    			setTimeout(function(){

    				elem.sendToAll(Constants.RULES_LIST, e)

    			},2500);

    			sendNextTurnTime = 5200;
    		}


    		/*Execute function func */

    		func(nextTurndata, sendNextTurnTime);

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
			var existPlayer = [{"userId":item.getUserId(),"photoId":item.getPhotoId()}];
			_this.sendTo(conn,Constants.NEWPLAYER_CODE,existPlayer);

			var playerAdded = [{"userId":added.getUserId(),"photoId":added.getPhotoId()}];
			_this.sendTo(item.getConn(),Constants.NEWPLAYER_CODE,playerAdded)
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
