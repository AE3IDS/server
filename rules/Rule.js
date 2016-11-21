
function Rule(activate,id){
    this.active = activate;
    this.ruleId = id;
}

Rule.prototype.checkCard = function checkCard(card){}
Rule.prototype.getId = function getId(){}
Rule.prototype.activate = function activate(){
    this.active = true;
}

Rule.prototype.isActive = function isActive(){
    return this.active;
}

module.exports = Rule;
