var Chance = require('chance').Chance();

const JOKER_SUIT = 0;
const JACK_KIND = 11;
const KIND_STR = "kind"
const EIGHTENDERS_KIND = 8;
const REVOLUTION_NUM_OF_CARDS = 4;

const JACKBACKRULE_ID = "R2";
const REVOLUTIONRULE = "R4";
const EIGHTENDERSRULE_ID = "R1";
const JOKERAREWILDRULE_ID = "R3";


function Bot(){

    this._userId = undefined;
    this._photoId = -1;
    this._cards = [];
    this._prevMoveCards = [];
    this._jokersCardIndices = [];
    this._roomRules = [];
    this._isReverse = false;
}

Bot.prototype.addCards = function addCards(cards)
{
    this._cards = cards;
    this.getJokers();
} 


Bot.prototype.addMoveCard = function addMoveCard(cards)
{
    this._prevMoveCards.push(cards);
}


Bot.prototype.setPhotoId = function setPhotoId(selectedPhotoIds)
{
    while(true)
    {
        var id = Chance.natural({min:0,max:8});
        
        if(selectedPhotoIds.indexOf(id) == -1)
        {    
            this._photoId = id;
            break;
        }
    }            
}


Bot.prototype.parseMoveRules = function parseMoveRules(rule)
{
    if(rule == JACKBACKRULE_ID || rule == REVOLUTIONRULE)
        this._isReverse = !this._isReverse;
}


Bot.prototype.addRoomRules = function addRoomRules(rules)
{
    this._roomRules = rules;
}

/* ==================== Cards  ========================= */


Bot.prototype.removeCards = function removeCards(cards)
{
    var temp = [];

    for(var j = 0; j < this._cards.length;j++)
    {
        var item = this._cards[j];
        var isItemInCards = false;


        var f = cards.filter(function(item1){

            var sameKind = item.getKind() == item1.getKind();
            var sameSuit = item.getSuit() == item1.getSuit();

            return sameKind && sameSuit;

        }).length


        // A zero value f, indicates that 'item' is not in 
        // cards, so not to be removed

        if(f == 0)
            temp.push(item);
    }

    this._cards = temp;

}



Bot.prototype.areCardsStronger = function areCardsStronger(reverse, cards, prev)
{
    var isLarger = false;

    cards.forEach(function(item,index){

        var tempIsLarger = item.isCardStronger(prev[index]);
        isLarger = (reverse ? !tempIsLarger : tempIsLarger);

    })

    return isLarger;
}


/* ----------------- Jack Back Rule ------------------ */


Bot.prototype.getCardsForJackBack = function getCardsForJackBack(reverse, prevMove)
{
    var output = undefined;

    var jackCards = this._cards.filter(function(item){
        return item.getKind() == JACK_KIND;
    })

    if(!prevMove)
    {
        output = jackCards.length == 0?output:jackCards; 
    }
    else
    {
        if(!(jackCards.length < prevMove.length))
        {
            jackCards = jackCards.slice(0, prevMove.length);

            if(this.areCardsStronger(reverse, jackCards, prevMove))
                output = jackCards;
        } 
    }

    return output;
}


/* ----------------- EightEnders Rule ------------------ */


Bot.prototype.getCardsForEightEnders = function getCardsForEightEnders(reverse, prevMove)
{
    var output = undefined;

    var eightCards = this._cards.filter(function(item){
        return item.getKind() == EIGHTENDERS_KIND;
    })

    if(!prevMove)
    {
        output = eightCards.length == 0?output:eightCards; 
    }
    else
    {
        if(!(eightCards.length < prevMove.length))
        {
            eightCards = eightCards.slice(0,prevMove.length)

            if(this.areCardsStronger(reverse, eightCards, prevMove))
                output = eightCards;
        } 
    }

    return output;
}

/*  ----------------- Revolution Rule --------------------- */


Bot.prototype.getCardsForRevolution = function getCardsForRevolution(reverse, prevMove)
{
    var h = this._cards.map(function(item,index){
        return {"pos":index,"kind":item.getKind()};
    })

    var sortedH = h.sort(this.sortBasedOnKind);
    var cards = this.getCardsWithQuantityOf(sortedH, REVOLUTION_NUM_OF_CARDS);

    var output = undefined;


    if(cards.length > 0)
    {

        // take the last element as it contains
        // the cards with the largest kind

        var temp = reverse?cards[0]:cards[cards.length - 1];

        if(!prevMove)
        {
            output = temp;
        }
        else
        {
            if(temp.length == prevMove.length)
            {
                if(this.areCardsStronger(reverse, temp, prevMove))
                    output = temp;
            }
        }  

    }


    return output;

}

/*  ---------------------------------------------------- */

/*  ---------------- General Rule ----------------------*/

/* comparing function used to sort */

Bot.prototype.sortBasedOnKind = function sortBasedOnKind(item1, item2)
{
    var item1Kind = item1[KIND_STR];
    var item2Kind = item2[KIND_STR];

    if(item1Kind < item2Kind)
    {
        return -1;
    }
    else if(item1Kind == item2Kind)
    {
        return 0;
    }
    else if(item1Kind > item2Kind)
    {
        return 1;
    }
}



Bot.prototype.lastIndexOfObjectWithRank = function lastIndexOfObjectWithRank(objects, startIndex, pivotKind)
{
    // var index = startIndex;

    for(;startIndex < (objects.length);startIndex++)
    {
        if(objects[startIndex][KIND_STR] != pivotKind)
        {
            return startIndex - 1;
        }
        else
        {
            if(startIndex == objects.length - 1)
                return startIndex;
        }
    }

    // return index;
}


Bot.prototype.getCardsWithQuantityOf = function getCardsWithQuantityOf(sorted, numOfCards)
{
    var counter = 0;
    var _this = this;
    var temp = [];

    while(counter < sorted.length)
    {
        var m = sorted[counter][KIND_STR];
        var lastIndex = this.lastIndexOfObjectWithRank(sorted, counter, m);

        // Convert index to length

        var num = lastIndex - counter + 1;

        if(numOfCards == num)
        {
            // The card/s that has quantity of numOfCards

            var slicedSorted = sorted.slice(counter, lastIndex+1);

            var slicedCards = slicedSorted.map(function(item){
                return _this._cards[item["pos"]]
            });

            temp.push(slicedCards)                                                                                                                                                  
        }

        counter = lastIndex + 1;
    }

    return temp;
}


Bot.prototype.getCardsForGeneralRule = function getCardsForGeneralRule(reverse, prevMove)
{
    var h = this._cards.map(function(item,index){
        return {"pos":index,"kind":item.getKind()};
    })

    // Sort the cards info of h based on value of kind property
    // Sort it so just need to go the array once and not check 
    // each item; 

    var sortedH = h.sort(this.sortBasedOnKind);
    var cards = undefined;

    if(!prevMove)
    {

        // By iterating backwards; maximises the probability that the bot will deal 
        // the most number of cards

        for(var numOfCards = this._cards.length; numOfCards != 0; numOfCards--)
        {
            cards = this.getCardsWithQuantityOf(sortedH, numOfCards);
            
            if(cards.length != 0)
                break;
        } 

        return cards[cards.length-1];
    }
    else
    {
        cards = this.getCardsWithQuantityOf(sortedH, prevMove.length);


        /* cards could be of zero length since it could be the case
        bot doesnt have the same amount of cards to be dealt as previous move */


        if(cards.length != 0)
        {
            var strongestCards = reverse?cards[0]:cards[cards.length-1];

            if (this.areCardsStronger(reverse, strongestCards, prevMove)) 
                 return strongestCards;
        }
    }

    return undefined;

}


/*  ---------------- End General Rule ----------------------*/


Bot.prototype.getJokers = function getJokers()
{
    var _this = this;

    var jokerIndex = this._cards.forEach(function(item,index){

        if(item.getSuit() == JOKER_SUIT)
            _this._jokersCardIndices.push(index);

    })
}


Bot.prototype.getTurnCards = function getTurnCards()
{

    var lastMove = this._prevMoveCards[this._prevMoveCards.length-1];

    var cards = undefined;

    if(this._roomRules.indexOf(EIGHTENDERSRULE_ID) != -1)
        cards = this.getCardsForEightEnders(this._isReverse,lastMove);

    if(cards == undefined && this._roomRules.indexOf(REVOLUTIONRULE) != -1)
        cards = this.getCardsForRevolution(this._isReverse,lastMove);

    if(cards == undefined && this._roomRules.indexOf(JACKBACKRULE_ID) != -1)
        cards = this.getCardsForJackBack(this._isReverse,lastMove);

    if(cards == undefined)
        cards = this.getCardsForGeneralRule(this._isReverse, lastMove);



    return cards;

}


/* ==================== End Cards ========================= */



Bot.prototype.getPhotoId = function getPhotoId()
{
    return this._photoId;
}


Bot.prototype.setUserId = function setUserId(userId)
{
    this._userId = userId;
}

Bot.prototype.getUserId = function getUserId()
{
    return this._userId
}


module.exports = Bot;


