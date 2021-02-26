const data = require('./E2Bdatabase.json');
const slot = 100000n;
const intSlot = 100000;
const p = 999999999959n;
const p2 = 999999999959;
var primaryHashArray;
var secondaryHashArray;
var uniqueData = [];
var a = BigInt(1+Math.floor(Math.random()*(p2-1)));
var b = BigInt(Math.floor(Math.random()*(p2-1)));

function wordToNum(word){  //function to convert a word to a corresponding integer
    var wordLen = word.length;
    var intWord = 0n;
    for(var i=0; i<wordLen; i++){
        intWord = (intWord*257n + BigInt(word.charCodeAt(i)+1)) % p;
    }
    return intWord;
}

const primaryHash = async () => {
    var len = data.length;
    var map = new Map();  //mapping for duplicate data
    for (var i=0; i<len; i++) {
        if (map.get(data[i].en) == undefined) {
            uniqueData.push(data[i]);
            map.set(data[i].en, 1);
        }
    }
    len = uniqueData.length;
    primaryHashArray = new Array(intSlot);
    for(var i=0; i<len; i++){
        var word = uniqueData[i].en;
        var k = wordToNum(word);
        var hash = (((a*k)+b)%p)%slot;
        if(primaryHashArray[hash] == undefined){
            primaryHashArray[hash] = [uniqueData[i]];
        }
        else{
            primaryHashArray[hash].push(uniqueData[i]);  //chaining
        }
    }
}

const secondaryHash = async () => {
    secondaryHashArray = new Array(intSlot);
    for(var i=0; i<intSlot; i++){
        if(!primaryHashArray[i]){
            continue;
        }
        var len = primaryHashArray[i].length;
        if(len < 2){  //only one word in the slot
            secondaryHashArray[i] = primaryHashArray[i];
            continue;
        }
        while(true){  //running until we find unique a2, b2 for an array slot which gives no collision
            var a2 = BigInt(1+Math.floor(Math.random()*(p2-1)));
            var b2 = BigInt(Math.floor(Math.random()*(p2-1)));
            var count = 0;
            var m = BigInt(len*len);
            secondaryHashArray[i] = new Array(m+3n);  //first 3 slots are for storing a2, b2 and m
            for(var j=0; j<len; j++){
                var word = primaryHashArray[i][j].en;
                var k = wordToNum(word);
                var hash = (((a2*k)+b2)%p)%m;
                if(secondaryHashArray[i][hash+3n] == undefined){  //if the slot is empty (means no clash occurred)
                    count++;
                }
                secondaryHashArray[i][hash+3n] = primaryHashArray[i][j];
            }
            if(count == len){  //if no clash occurred, store the specific a2, b2 and m
                secondaryHashArray[i][0n] = a2;
                secondaryHashArray[i][1n] = b2;
                secondaryHashArray[i][2n] = m;
                break;
            }
        }
    }
}

const wordQuery = async req =>{
    var word = req.query.word;
    word = word.toLowerCase();
    var k = wordToNum(word);
    var hash = ((a*k+b)%p)%slot;
    if(secondaryHashArray[hash] == undefined){
        return "Word Not found";
    }
    var len = secondaryHashArray[hash].length;
    if(len<2){
        if(secondaryHashArray[hash][0].en==word){
            return secondaryHashArray[hash][0].bn;
        }
        else{
            return "Word Not found";
        }
    }
    else{
        var a2 = secondaryHashArray[hash][0n];
        var b2 = secondaryHashArray[hash][1n];
        var m = secondaryHashArray[hash][2n];
        var hash2 = ((a2*k+b2)%p)%m;
        if(secondaryHashArray[hash][hash2+3n] == undefined){
            return "Word Not found";
        }
        else if(secondaryHashArray[hash][hash2+3n].en == word){
            return secondaryHashArray[hash][hash2+3n].bn;
        }
        else{
            return "Word Not found";
        }
    }
}

module.exports.wordQuery = async (req, res) => {
    const result = await wordQuery(req);
    res.send(result);
}
module.exports.primaryHash = async (req, res) => {
    await primaryHash();
}
module.exports.secondaryHash = async () => {
    await secondaryHash();
}