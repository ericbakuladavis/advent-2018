function getOptions(directions, startIndex){
    let openParens = 1;
    let option = '';
    const options = [];
    for (let i = startIndex + 1; i < directions.length; i++){
        let char = directions[i];
        if (char === '('){
            openParens++;
        } else if (char === ')'){
            openParens--;
        }
        if (openParens === 1){
            if (char === '|'){
                options.push(option);
                option = '';
                continue;
            }
        } else if (openParens === 0){
            options.push(option);
            break;
        }
        option += char;
    }
    return options;
}

function makePaths(directions, path){
    let stop = false;
    for (let i = 0; i < directions.length; i++){
        if (stop){
            return;
        }
        const char = directions[i];
        if (char === '('){
            const options = getOptions(directions, i);
            let emptyOption = undefined;
            options.forEach((option) => {
                if (option === ''){
                    emptyOption = true;
                }
            });
            if (!emptyOption){
                options.forEach((option) => {
                    makePaths(option, path);
                    stop = true;
                });
            } else {
                let optionBlockLength = 0; 
                options.forEach((option) => {
                    optionBlockLength += option.length;
                    let newPath = path;
                    for (let i = 0; i < option.length / 2; i++){
                        const char = option[i];
                        newPath += char;
                        paths.add(newPath);
                    }
                });
                optionBlockLength += options.length;
                i += optionBlockLength;
            }
        } else {
            path += char;
            paths.add(path);
        }
    }
}

const fs = require('fs');
const input = fs
                .readFileSync(`${__dirname}/31.txt`, 'utf8')

const directions = input.slice(1, input.length - 1);
const paths = new Set();
makePaths(directions, '');

let over1K = 0;
let maxDistance = 0;
paths.forEach((path) => {
    for(let i = 0; i < path.length - 1; i++){
        const char = path[i];
        const char2 = path[i + 1];
        if ((char === 'N' && char2 === 'S') || (char === 'S' && char2 === 'N') || (char === 'E' && char2 === 'W') || (char === 'W' && char2 === 'E')){
            return;
        }
    }
    if (path.length >= 1000){
        over1K++;
    }
    if (path.length > maxDistance){
        maxDistance = path.length
    }
});

console.log('part 1:', maxDistance);
console.log('part 2:', over1K);