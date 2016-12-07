
var Constant = require('./Constants');
var jsonmaker = require('./JSONMaker');
var Room = require('./Room');


function Game(){

    this._rooms = [];

}

function getRoomWithUserId(id,rooms){

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

function createRoom(rooms, rules, mode){
 
    var room = new Room(rooms.length+1, mode);
    rooms.push(room);
        
    return  room;
	
}

exports.Game = function(){
    return new Game();
}

function greetCodeHandler(data, rooms,connection){

    var room = getRoomWithUserId(data.data.userId,rooms);
    room.sendRoomDetails(connection,Constant.GREET_CODE);
    room.sendPlayers(connection,Constant.NEWPLAYER_CODE);
}

function cardCodeHandler(data,rooms){

    var room = getRoomWithUserId(data.data.userId,rooms);
    room.getCards(data.data.userId);

}

function readyCodeHandler(data,rooms){
 
    var room = getRoomWithUserId(data.data.userId,rooms);
    room.addReady();

}

function lobbyDetailsCodeHandler(data,rooms,connection){
    
    var room = createRoom(rooms,data.data.rules,data.data.mode);
    room.addPlayer(connection, Constant.LOBBYDETAILS_CODE, data.data.avatar);

}

function dealCardCodeHandler(data,rooms){

    var userId = data.userId;
    var room = getRoomWithUserId(userId,rooms);
    room.addDealtCardsToPlayer(userId,data.data);

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
    }


    if(output != undefined){
        connection.send(JSON.stringify(output));
    }

}
//module.exports = Game;
