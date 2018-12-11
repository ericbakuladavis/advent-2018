function react(input){
    input = input.split('');
    let i = 0;
    while (i < input.length - 1){
        const currentUnit = input[i];
        const unitToTheRight = input[i + 1];
        if (currentUnit.toUpperCase() === unitToTheRight.toUpperCase() && currentUnit !== unitToTheRight){
            input.splice(i, 2);
            if (i > 0){
                i--;
            }
        } else {
            i++;
        }
    }
    return input;
}

function removeUnits(unitToDelete, input){
    input = input.split('');
    return input.filter(unit => unit !== unitToDelete && unit !== unitToDelete.toUpperCase()).join('');
}

const fs = require('fs');
const input =   fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')

const units = 'abcdefghijklmnopqrstuvwxyz';

reactedPolymer = react(input);

console.log(reactedPolymer.length); // 9900

let shortestPolymerLength = reactedPolymer.length;

for (let i = 0; i < units.length; i++){
    const unitToDelete = units[i];
    const filteredPolymer = removeUnits(unitToDelete, input);
    const filteredReactedPolymer = react(filteredPolymer);
    if (filteredReactedPolymer.length < shortestPolymerLength){
        shortestPolymerLength = filteredReactedPolymer.length;
    }
}

console.log(shortestPolymerLength); // 4992