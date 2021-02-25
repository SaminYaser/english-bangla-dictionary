const data = require('./BengaliDictionary.json');
const slot = 16920;
const p = 652339;
const modP = 652447;
//const p2 = 652343;
var primaryHashArray;
var secondaryHashArray;
var a = 1+Math.floor(Math.random()*(p-1));
var b = Math.floor(Math.random()*(p-1));

const wordToNum = async (word) => {  //function to convert a word to a corresponding integer
    var wordLen = word.length;
    var intWord = 0;
    for(var i=0; i<wordLen; i++){
        intWord = (intWord*257 + word.charCodeAt(i)) % modP;
    }
    return intWord;
}

const primaryHash = async () => {
    var len = data.length;
    primaryHashArray = new Array(slot);
    for(var i=0; i<len; i++){
        var word = data[i].en;
        var k = wordToNum(word);
        var hash = ((a*k+b)%p)%slot;
        if(!primaryHashArray[hash]){
            primaryHashArray[hash] = data[i];
        }
        else{
            primaryHashArray[hash].push(data[i]);  //chaining
        }
    }
}

const secondaryHash = async () => {
    secondaryHashArray = new Array(slot);
    for(var i=0; i<slot; i++){
        if(!primaryHashArray[i]){
            continue;
        }
        var len = primaryHashArray[i].length;
        if(len < 2){  //only one word in the slot
            secondaryHashArray[i] = primaryHashArray[i];
            continue;
        }
        while(true){
            var a2 = 1+Math.floor(Math.random()*(p-1));
            var b2 = Math.floor(Math.random()*(p-1));
            var count = 0;
            var m = len*len;
            secondaryHashArray[i] = new Array(m+3);  //first 3 slots are for storing a2, b2 and m
            for(var j=0; j<len; j++){
                var word = primaryHashArray[i][j].en;
                var k = wordToNum(word);
                var hash = ((a*k+b)%p)%m;
                if(!secondaryHashArray[i][hash+3]){  //if the slot is empty (means no clash occurred)
                    count++;
                }
                secondaryHashArray[i][hash+3] = primaryHashArray[i][j];
            }
            if(count == len){  //if no clash occurred, store the specific a2, b2 and m
                secondaryHashArray[i][0] = a2;
                secondaryHashArray[i][1] = b2;
                secondaryHashArray[i][2] = m;
                break;
            }
        }
    }
}
