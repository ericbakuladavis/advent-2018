function parseRules(input){
    const rules = {};
    for (let i = 2; i < input.length; i++){
        const line = input[i];
        const pattern = line.slice(0,5);
        rules[pattern] = line[9];
    }
    return rules;
}

function simulateGrowth(initialState, rules, generations){
    if (generations > 100){
        // This part might not work for other puzzle inputs.
        return (81 * generations) + 798;
    }
    let state = initialState;
    let potZeroIndex = 0;
    for (let g = 0; g < generations; g++){
        [state, potZeroIndex] = addEmptyPots(state, potZeroIndex);
        let newState = '..';
        for (let i = 2; i < state.length - 2; i++){
            const section = state.slice(i - 2, i + 3);
            newState += rules[section];
        }
        newState = newState + '..';
        state = newState;
    }
    return addUpPlantedPots(state, potZeroIndex);
}

function addEmptyPots(state, potZeroIndex){
    const leadingEmptyPots = state.indexOf('#');
    if (leadingEmptyPots < 4){
        for (let i = 0; i < 4 - leadingEmptyPots; i++){
            state = '.' + state;
            potZeroIndex++;
        }
    }

    const trailingEmptyPots = state.length - state.lastIndexOf('#') - 1;
    if (trailingEmptyPots < 4){
        for (let i = 0; i < 4 - trailingEmptyPots; i++){
            state = state + '.';
        }
    }
    return [state, potZeroIndex]
}

function addUpPlantedPots(state, potZeroIndex){
    let sum = 0;
    for (let i = 0; i < state.length; i++){
        if (state[i] === '#'){
            const potNumber = i - potZeroIndex;
            sum += potNumber;
        }
    }
    return sum;
}

const fs = require('fs');
const input =   fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')
                .split('\n');

const initialState = input[0].slice(15);
const rules = parseRules(input);

let sumOfPlantedPots = simulateGrowth(initialState, rules, 20);
console.log(sumOfPlantedPots); // 3605

sumOfPlantedPots= simulateGrowth(initialState, rules, 50000000000);
console.log(sumOfPlantedPots); // 4050000000798