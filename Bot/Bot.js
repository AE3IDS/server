var Chance = require('chance').Chance();

function Bot(){

    this._userId = Chance.string({length:5}); 
}

module.exports = Bot;


