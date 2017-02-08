
var Constant = require('./Constants');
var jsonmaker = require('./JSONMaker');
var Room = require('./Room');
var MessageQueue = require('./MessageQueue');
var Message = require('./Message');
var RulesHandler = require('./rules/RulesHandler');



function Game(){

    this._rooms = [];
    this._rulesHandler = new RulesHandler();
}

function getRoomForUserId(id,rooms){

    var foundRoom = false;
    var room = undefined;

    rooms.forEach(function(item,index){
        if(item.checkPlayerWithId(id) && !foundRoom){
            foundRoom = true;
            room = item;
        }
    });

    return room;
}

function joinRoom(roomId, rooms,avatarId){
    
    var r = rooms.filter(function(val){
            return val.getRoomId() == roomId;
        })

    //r[0].addPlayer(

}

exports.Game = function(){
    return new Game();
}


function turnCodeHandler(conn, data,rooms){
    
    var room = getRoomForUserId(data.data.userId,rooms);
    room.getFirstTurn(conn, data.data.userId);

}

/* 1st Function Called */

function lobbyDetailsCodeHandler(data, rooms, conn, rules)
{    
    var rules1 = rules.getRules([]);
    
    var room = new Room(rooms.length+1, rules1, data.data.mode);
    rooms.push(room);

    room.addPlayer(conn, data.data.avatarId);
}

/* 2nd Function called */

function greetCodeHandler(data, rooms,connection)
{
    var room = getRoomForUserId(data.data.userId,rooms);
    room.requestPlayers(connection,data.data.userId);
}


function cardCodeHandler(conn, data,rooms){

   var userId = data.data.userId;
   var room = getRoomForUserId(userId,rooms);
   room.requestCards(conn,userId);

}

function moveCodeHandler(data, rooms)
{
    var userId = data.data.userId;
    var room = getRoomForUserId(userId,rooms);
    room.addPlayerMove(userId,data.data.cards);
}


function endDistributeHandler(data, rooms){
	
	var userId = data.data.userId;
    var room = getRoomForUserId(userId,rooms);
    room.switchTurn(userId);
	
}

function roomListHandler(conn, rooms){
    
    var rooms1 = [];

    rooms.forEach(function(item){
    
        var room = {"roomId":item.getRoomId(),
                    "numOfPlayers":item.getNumberOfPlayers()}
        
        rooms1.push(room);
    });

    var msg = new Message(Constant.ROOMLIST_CODE,rooms1);
    MessageQueue.send(conn,[msg]);
}

function joinGameHandler(conn, data, rooms){

    var joinRoomId = data.data.roomId;
    var joinAvatar = data.data.avatarId;

    rooms.forEach(function(room){

        if(room.getRoomId() == joinRoomId){
            console.log("join room: " + joinRoomId);
            room.addPlayer(conn,joinAvatar);
        }

    });
}

function fetchRuleHandler(conn, ruleHandler)
{
    var rules = ruleHandler.getAvailableRules();
    var msg = new Message(Constant.FETCHRULE_CODE,rules);
    MessageQueue.send(conn,[msg]);
}

function passTurnCodeHandler(data, rooms)
{
    var userId = data.data.userId;
    var room = getRoomForUserId(userId,rooms);
    room.passTurnHandler(userId);
}

Game.prototype.handleMessage = function(connection,dt){

    var data = JSON.parse(dt);
	var output = undefined;

    switch(data.code){

        case Constant.GREET_CODE:
            greetCodeHandler(data,this._rooms,connection);
            break;

        case Constant.MOVE_CODE:
            moveCodeHandler(data,this._rooms);
            break;

        case Constant.TURN_CODE:
            turnCodeHandler(connection, data,this._rooms);
            break;

        case Constant.LOBBYDETAILS_CODE:
            lobbyDetailsCodeHandler(data,this._rooms,connection, this._rulesHandler);
            break;

        case Constant.CARD_CODE:
            cardCodeHandler(connection, data,this._rooms);
            break;
            
		case Constant.ENDDISTRIBUTE:
			endDistributeHandler(data,this._rooms);
			break;

        case Constant.ROOMLIST_CODE:
            roomListHandler(connection,this._rooms);
            break;

        case Constant.PASSTURN_CODE:
            passTurnCodeHandler(data, this._rooms);
            break;   

        case Constant.JOINGAME_CODE:
            joinGameHandler(connection,data,this._rooms);
            break;
            
        case Constant.FETCHRULE_CODE:
            fetchRuleHandler(connection,this._rulesHandler);
            break;
    }       


    if(output != undefined){
        connection.send(JSON.stringify(output));
    }

}
//module.exports = Game;
