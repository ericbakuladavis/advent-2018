function getSurroundingAcres(input, rowIndex, columnIndex){
    const surroundingAcres = [];
    const upIndex = rowIndex - 1;
    const downIndex = rowIndex + 1;
    const rightIndex = columnIndex + 1;
    const leftIndex = columnIndex - 1;
    const upAcre = input[upIndex];
    const downAcre = input[downIndex];
    const rightAcre = input[0][rightIndex];
    const leftAcre = input[0][leftIndex];
    if (upAcre) surroundingAcres.push(input[upIndex][columnIndex]);
    if (downAcre) surroundingAcres.push(input[downIndex][columnIndex]);
    if (rightAcre) surroundingAcres.push(input[rowIndex][rightIndex]);
    if (leftAcre) surroundingAcres.push(input[rowIndex][leftIndex]);
    if (upAcre && rightAcre) surroundingAcres.push(input[upIndex][rightIndex]);
    if (upAcre && leftAcre) surroundingAcres.push(input[upIndex][leftIndex]);
    if (downAcre && rightAcre) surroundingAcres.push(input[downIndex][rightIndex]);
    if (downAcre && leftAcre) surroundingAcres.push(input[downIndex][leftIndex]);
    return surroundingAcres;
}

function count(surroundingAcres, symbol){
    let theCount = 0;
    surroundingAcres.forEach((acre) => {
        if (acre === symbol){
            theCount++;
        }
    });
    return theCount;
}

function simulate(input, minutesLimit){
    let minutes = 0;
    let strings = {};
    let part1 = undefined;
    let part2 = undefined;
    while (part2 === undefined){
        const newMap = [];
        input.forEach((row, rowIndex) => {
            newMap.push([]);
            row.forEach((acre, columnIndex) => {
                let newAcre = acre;
                const surroundingAcres = getSurroundingAcres(input, rowIndex, columnIndex);
                if (acre === '.' && count(surroundingAcres, '|') >= 3){
                    newAcre = '|';
                } else if (acre === '|' && count(surroundingAcres, '#') >= 3){
                    newAcre = '#';
                } else if (acre === '#' && (count(surroundingAcres, '#') === 0 || count(surroundingAcres, '|') === 0)){
                    newAcre = '.';
                }
                newMap[rowIndex][columnIndex] = newAcre;
            });
        });
        input = newMap;
        minutes++;
        if (minutes === 10){
            part1 = getResourceValue(input);
        }
        const string = JSON.stringify(input);
        if (strings.hasOwnProperty(string)){
            const secondOccurance = minutes;
            const firstOccurance = strings[string];
            const difference = secondOccurance - firstOccurance;
            const theMinute = ((minutesLimit - firstOccurance) % difference) + firstOccurance;
            for (currentString in strings){
                const minute = strings[currentString];
                if (minute === theMinute){
                    part2 = getResourceValue(JSON.parse(currentString));
                }
            }
        } else {
            strings[string] = minutes;
        }
    }
    return {part1, part2};
}

function getResourceValue(input){
    let forests = 0;
    let yards = 0;
    input.forEach((row) => {
        row.forEach((acre) => {
            if (acre === '|'){
                forests++;
            } else if (acre === '#'){
                yards++;
            }
        });
    });
    return forests * yards;
}

const fs = require('fs');
const input = fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')
                .split('\n')
                .map((line) => line.split(''));

const {part1, part2} = simulate(input, 1000000000);
console.log('part1: ', part1);
console.log('part2 :', part2);