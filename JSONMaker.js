function JSONMaker(){}

JSONMaker.makeGreetJSON = function(roomDetails,userID){

	var output = [{
			"response":{
				"type":"greet",
				"data":{
					"round":roomDetails.round.toString(),
					"user":userID
					}
				}
			}];

	return output;
}

module.exports = JSONMaker
