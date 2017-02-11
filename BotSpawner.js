const spawn = require('child_process').spawn
const fs = require('fs');
const out = fs.openSync('./Bot/stdout.log', 'a');


function BotSpawner(roomId, numOfBot)
{
    this._roomId = roomId;


   var spawnFunction = function(){

        const ls = spawn("/usr/local/bin/node",["Bot/ClientMain.js", roomId],{detached:true, stdio:['ignore',out, out]})
        ls.unref();

        numOfBot--;

        if(numOfBot != 0)
            setTimeout(spawnFunction,1500);

    }

    spawnFunction();


}

BotSpawner.spawn = function spawn(numOfBot)
{

}


module.exports = BotSpawner
