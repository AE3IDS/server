
var ClientConstant = require('./ClientConstant');
var Bot = require('./Bot');
var Card = require("../Card");
// var MessageQueue = require('./MessageQueue');
// var Message = require('./Message');


function ClientModel(roomId){

    this._roomId = roomId;
    this._socket = undefined;
    this._bot = new Bot();
}

ClientModel.prototype.setSocket = function setSocket(sock)
{
	this._socket = sock;
}

ClientModel.prototype.requestAvatar = function requestAvatar()
{   
    var s = makeJSON(ClientConstant.REQUESTAVATARS_CODE,{"roomId":this._roomId});
    this._socket.send(s);
}

ClientModel.prototype.parse = function parse(msg)
{
	var parsedJSON = JSON.parse(msg);
	var content = (parsedJSON.pop())["response"]

	var code = content["code"];
	var data = content["data"];

	switch(code)
	{
		case ClientConstant.REQUESTAVATARS_CODE:
			requestAvatarHandler(this, data);
		break;

		case ClientConstant.LOBBYDETAILS_CODE:
			lobbyHandler(this, data);
		break;

		case ClientConstant.CARD_CODE:
			cardCodeHandler(this,data);
		break;
	}
}

function cardCodeHandler(elem, data)
{
	var cards = data["cards"];
	var temp = [];

	for(var i = 0; i < cards.length; i++)
	{
		var suit = cards[i]["_suit"];
		var kind = cards[i]["_kind"];

		temp.push(new Card(suit,kind));
	}

	elem._bot.addCards(temp);
}

function requestAvatarHandler(elem, data)
{
	elem._bot.setPhotoId(data);

	var joinData = {"roomId":elem._roomId,"avatarId":elem._bot.getPhotoId()}
	joinData = makeJSON(ClientConstant.JOINGAME_CODE,joinData);

	elem._socket.send(joinData);
}

function lobbyHandler(elem, data)
{
	elem._bot.setUserId(data["userId"]);

	var greetData = {"userId":elem._bot.getUserId()};
	greetData = makeJSON(ClientConstant.GREET_CODE, greetData);

	elem._socket.send(greetData);
}

function makeJSON(code, data)
{
    var data1 = {"code":code,"data":data};
    return JSON.stringify(data1);
}

module.exports = ClientModel;
