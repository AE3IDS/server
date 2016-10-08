
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
        if(!item.checkPlayerWithId(id) && !foundRoom){
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

Game.prototype.handleMessage = function(connection,dt){

    //console.log("asdfs");

     //try{
        
        var data = JSON.parse(dt);
	    var output = undefined;


        if(data.code == Constant.GREET_CODE){

            var room = getRoomWithUserId(data.data.userId,this._rooms);

            // Send room details to user

            room.sendRoomDetails(connection,Constant.GREET_CODE);

            // Send details of each of the player
            // in the room
            
            room.sendPlayers(connection,Constant.NEWPLAYER_CODE);


        }else if(data.code == Constant.ROOMLIST_CODE){

            output  = jsonmaker.makeResponseJSON({"rooms":this._rooms},Constant.ROOMLIST_CODE);

        }else if(data.code == Constant.LOBBYDETAILS_CODE){

            // create new game room

            var room = createRoom(this._rooms,data.data.rules,data.data.mode);

            // add the host

            room.addPlayer(connection, Constant.LOBBYDETAILS_CODE, data.data.avatar);
            
            console.log("Total amount of Rooms is: " + this._rooms.length);

        }else if(data.code == Constant.FETCHRULE_CODE){
            
            output = jsonmaker.makeResponseJSON({rules:[]}, Constant.FETCHRULE_CODE);

        }
        

        if(output != undefined){
             connection.sendUTF(JSON.stringify(output));
        }
        
    //}catch(e){
      //  console.log("error occured " + e.message);
        //process.exit(1);
    //} 

}
//module.exports = Game;
