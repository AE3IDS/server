function JSONMaker(){}

function createJson(code, data){

     var output = [{
            "response":{
                "code":code,
                "data":data
            }
    }]    

     return output;
}

JSONMaker.makeResponseJSON = function(data,code){
    return createJson(code,data);
}

module.exports = JSONMaker
