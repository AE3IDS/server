
var ClientConstant = require('./ClientConstant');
// var MessageQueue = require('./MessageQueue');
// var Message = require('./Message');


function ClientModel(roomId){

    this._roomId = roomId;
}

ClientModel.prototype.requestAvatar = function requestAvatar(ws)
{   
    var s = makeJSON(ClientConstant.REQUESTAVATARS_CODE,{"roomId":this._roomId});
    ws.send(s);
}

function makeJSON(code, data)
{
    var data1 = {"code":code,"data":data};
    return JSON.stringify(data1);
}

module.exports = ClientModel;
