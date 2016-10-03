
var Constant = require('./Constants');
var jsonmaker = require('./JSONMaker');
var Room = require('./Room');


function Game(){
    
    console.log("create");
    this._rooms = [];

}

function createRoom(){

	var r = new Room();	
	this._rooms.push(r);	
	return r;
}

function getRoom(rooms){

	var added = false;		
	var room = undefined;		

	rooms.forEach(function(item, index){
		console.log(item.isRoomAvailable());
		if(item.isRoomAvailable() && !added){
			added = true;
			room = item;	
		}
	})
 
    // if added is false, all rooms are occupied. so create new room

    if(!added){
        room = new Room(rooms.length+1);
        rooms.push(room);
    }

    //console.log(room);
        
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
                
                var room = getRoom(this._rooms);
                console.log(this._rooms.length);
                output = jsonmaker.makeGreetJSON(room,room.addPlayer(),Constant.GREET_CODE);

			    break;
					
		    // get roomlist message

            case Constant.ROOMLIST_CODE:
	            output  = jsonmaker.makeRoomListJSON(this._rooms,Constant.ROOMLIST_CODE);
			    break;
		
        }
        
        connection.sendUTF(JSON.stringify(output));

    //}catch(e){
      //  console.log("error occured " + e.message);
        //process.exit(1);
    //} 

}
//module.exports = Game;
