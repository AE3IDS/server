var jsonmaker = require('./JSONMaker');

function MessageQueue(){}

MessageQueue.send = function send(conn,dt){

    var data = dt.shift();
    var output = jsonmaker.makeResponseJSON(data.getData(),data.getCode());

    if(conn.readyState == 1)
    	conn.send(JSON.stringify(output));   

}

module.exports = MessageQueue;
