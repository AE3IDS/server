function Message(code, data){

    this._code = code;
    this._data = data;

}

Message.prototype.getCode = function getCode(){

    return this._code;
}

Message.prototype.getData = function getData(){

    return this._data;
}

module.exports = Message;
