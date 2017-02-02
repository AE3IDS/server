
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


function cardCodeHandler(data,rooms){

    var room = getRoomForUserId(data.data.userId,rooms);
    room.getCards(data.data.userId);

}

function readyCodeHandler(data,rooms){
 
    var room = getRoomForUserId(data.data.userId,rooms);
    room.addReady();

}

/* 1st Function Called */

function lobbyDetailsCodeHandler(data, rooms, conn)
{    
    var rules = this._rulesHandler.getRules(data.data.rules);
    
    var room = new Room(rooms.length+1, rules, data.data.mode);
    rooms.push(room);

    room.addPlayer(conn, data.data.avatar);
}

/* 2nd Function called */

function greetCodeHandler(data, rooms,connection)
{
    var room = getRoomForUserId(data.data.userId,rooms);
    room.initialize(connection,Constant.NEWPLAYER_CODE);
}


function dealCardCodeHandler(data,rooms){

    var userId = data.userId;
    var room = getRoomForUserId(userId,rooms);
    room.addDealtCardsToPlayer(userId,data.data);

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

Game.prototype.handleMessage = function(connection,dt){

    var data = JSON.parse(dt);
	var output = undefined;

    switch(data.code){

        case Constant.GREET_CODE:
            greetCodeHandler(data,this._rooms,connection);
            break;

        case Constant.CARD_CODE:
            cardCodeHandler(data,this._rooms);
            break;

        case Constant.READY_CODE:
            readyCodeHandler(data,this._rooms);
            break;

        case Constant.LOBBYDETAILS_CODE:
            lobbyDetailsCodeHandler(data,this._rooms,connection);
            break;

        case Constant.DEALCARD_CODE:
            dealCardCodeHandler(data,this._rooms);
            break;
            
		case Constant.ENDDISTRIBUTE:
			endDistributeHandler(data,this._rooms);
			break;

        case Constant.ROOMLIST_CODE:
            roomListHandler(connection,this._rooms);
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
