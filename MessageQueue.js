var jsonmaker = require('./JSONMaker');

function MessageQueue(){}

MessageQueue.send = function send(conn,dt){

    var d = dt;
    
    var interval = setInterval(function(){

        var data = d.shift();
        var output = jsonmaker.makeResponseJSON(data.getData(),data.getCode());

        conn.send(JSON.stringify(output));        

        if(d.length == 0){
            clearInterval(interval);
        }

    },1000);

}

module.exports = MessageQueue;
