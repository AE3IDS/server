function User(){
	// generate random id
	this._userId = "asdasdas"
}

User.prototype.getUserId = function getUserId(){
	return this._userId;
}

module.exports  = User;
