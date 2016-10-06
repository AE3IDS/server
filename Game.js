
var Constant = require('./Constants');
var jsonmaker = require('./JSONMaker');
var Room = require('./Room');


function Game(){

    this._rooms = [];

}

function getRoomWithId(id,rooms){

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

function createRoom(rooms, rules){
 
    var room = new Room(rooms.length+1);
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


		switch(data.request.code){
					
		    // greet message

            case Constant.GREET_CODE:
                var room = getRoomWithId(data.request.data.userId, this._rooms);
                output = jsonmaker.makeGreetJSON(room,Constant.GREET_CODE);
			    break;
					
		    // get roomlist message

            case Constant.ROOMLIST_CODE:
	            output  = jsonmaker.makeRoomListJSON(this._rooms,Constant.ROOMLIST_CODE);
			    break;


            // when host send selected rules

            case Constant.SELECTEDRULE_CODE:
                var room = createRoom(this._rooms,data.request.data.rules);
                console.log(this._rooms.length);
                break;

            
            // when host request all the ruels

		    case Constant.FETCHRULE_CODE:
                output = jsonmaker.makeRulesJSON(Constant.FETCHRULE_CODE,{rules:[]});
                break;
        }
        
        connection.sendUTF(JSON.stringify(output));

    //}catch(e){
      //  console.log("error occured " + e.message);
        //process.exit(1);
    //} 

}
//module.exports = Game;
