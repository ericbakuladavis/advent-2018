const fs = require('fs');
const input =   fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')
                .split('\n');

let idsWithDoubles = 0;
let idsWithTriples = 0;

input.forEach((id) => {
    const letterCounts = {};
    for (let i = 0; i < id.length; i++){
        let letter = id[i];
        if (letterCounts.hasOwnProperty(letter)){
            letterCounts[letter]++;
        } else {
            letterCounts[letter] = 1;
        }
    }

    let hasDouble = undefined;
    let hasTriple = undefined;

    for (letter in letterCounts){
        if (letterCounts[letter] === 2){
            hasDouble = true;
        } else if (letterCounts[letter] === 3){
            hasTriple = true;
        }
    }
    
    if (hasDouble === true){
        idsWithDoubles++;
    }
    if (hasTriple === true){
        idsWithTriples++;
    }
});

const checksum = idsWithDoubles * idsWithTriples;
console.log(checksum); //9633