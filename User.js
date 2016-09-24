
var Chance = require('chance');

function User(){

	var chance = new Chance();
	// generate random id
	this._userId = chance.string({length:5});
}

User.prototype.getUserId = function getUserId(){
	return this._userId;
}

module.exports  = User;
