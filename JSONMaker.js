function JSONMaker(){}

function createJson(code, data){

     var output = [{
            "response":{
                "code":code,
                "data":data
            }
    }]    

     return output;
}


JSONMaker.makeGreetJSON = function(room,userID,code){

    var details = room.getRoomDetails();
    details["user"] = userID;
            
	return createJson(code,details);
}


JSONMaker.makeRoomListJSON = function(roomList,code){
    
    var ar = [];
    roomList.forEach(function(item,index){
        ar.push(item.getRoomDetails());
    }) 

    return createJson(code,ar);
}
module.exports = JSONMaker
