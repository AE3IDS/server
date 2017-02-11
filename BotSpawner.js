const spawn = require('child_process').spawn
const fs = require('fs');
const out = fs.openSync('./out.log', 'a');


function BotSpawner(roomId, numOfBot)
{
    this._roomId = roomId;
    for(var i = 0;i < numOfBot;i++)
    {
        const ls = spawn("/usr/local/bin/node",["Bot/ClientMain.js", roomId],{detached:true, stdio:['ignore',out, out]})
        ls.unref();
    }
}

BotSpawner.spawn = function spawn(numOfBot)
{

}


module.exports = BotSpawner
