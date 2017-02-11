
var ClientConstant = require('./ClientConstant');
// var MessageQueue = require('./MessageQueue');
// var Message = require('./Message');


function ClientModel(roomId){

    this._roomId = roomId;
    this._socket = undefined;
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
}

function makeJSON(code, data)
{
    var data1 = {"code":code,"data":data};
    return JSON.stringify(data1);
}

module.exports = ClientModel;
