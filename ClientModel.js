
var Constant = require('./Constants');
var MessageQueue = require('./MessageQueue');
var Message = require('./Message');


function ClientModel(roomId){

    this._roomId = roomId;
}

module.exports = ClientModel;
