const fs = require('fs');
const input =   fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')
                .split('\n')
                .map((num) => parseInt(num));

let repeatFound = false;

const seen = new Set();
let currentFrequency = 0;
let frequencyChange = undefined;

while (repeatFound === false){
    for (let i = 0; i < input.length; i++){
        frequencyChange = input[i];
        currentFrequency += frequencyChange;
        if (seen.has(currentFrequency)){
            repeatFound = true;
            break;
        } else {
            seen.add(currentFrequency);
        }
    }
}

const firstRepeatFrequency = currentFrequency;
console.log(firstRepeatFrequency);

const finalFrequency = input.reduce((sum, change) => sum + change);
console.log(finalFrequency); //497