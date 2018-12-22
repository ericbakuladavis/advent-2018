const fs = require('fs');
const input = fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')
                .split('\n');

function parseInput(input){
    const veins = [];
    let maxX = undefined;
    let minX = undefined;
    let maxY = undefined;

    input.forEach((line) => {
        const numbers = line.match(/\d+/g)
                            .map((string) => parseInt(string));
        const vein = {};
        let bigX = undefined;
        let smallX = undefined;
        let bigY = undefined;

        if (line[0] === 'x'){
            vein.x = numbers[0];
            vein.y = numbers.slice(1);
            bigX = vein.x;
            smallX = vein.x;
            bigY = vein.y[1];
        } else {
            vein.x = numbers.slice(1);
            vein.y = numbers[0];
            bigX = vein.x[1];
            smallX = vein.x[0];
            bigY = vein.y;
        }

        if (maxX === undefined){
            maxX = bigX;
        } else if (bigX > maxX){
            maxX = bigX;
        }

        if (minX === undefined){
            minX = smallX;
        } else if (smallX < minX){
            minX = smallX;
        }

        if (maxY === undefined){
            maxY = bigY;
        } else if (bigY > maxY){
            maxY = bigY;
        }
        veins.push(vein);
    });
    
    return {veins, maxX, maxY};
}

function makeMap(parsedInput){
    const {veins, maxX, maxY} = parsedInput;
    const map = [];
    for (let y = 0; y <= maxY; y++){
        map.push([]);
        for (let x = 0; x <= maxX; x++){
            map[y].push('.');
        }
    }
    
    veins.forEach((vein) => {
        if (typeof vein.x === 'number'){
            for (y = vein.y[0]; y <= vein.y[1]; y++){
                map[y][vein.x] = '#';
            }
        } else if (typeof vein.y === 'number'){
            for (x = vein.x[0]; x <= vein.x[1]; x++){
                map[vein.y][x] = '#';
            }
        }
    });
    map[0][500] = '+';
    return map;
}

function dropWater(head, map){
    let x = head[0];
    let y = head[1];
    let bottomReached = false;
    let returnValue = undefined;
    while (bottomReached === false){
        if (map[y + 1] === undefined){
            bottomReached = true;
        } else {
            let below = map[y + 1][x]
            if (below === '|'){
                bottomReached = true;
            } else if (below === '#' || below === '~'){
                bottomReached = true;
                returnValue = [x, y];
            }
        }
        map[y][x] = '|';

        // console.clear();
        // printMap(map, y);
        // sleep(25);

        y++;
    } 
    return returnValue;

}

function findLimit(x, y, direction, map){
    let limitFound = false;
    let head = [];
    while (limitFound === false){
        x += direction;
        const tile = map[y][x];
        const below = map[y + 1][x];
        if (tile === '#'){
            limitFound = true;
        }
        if (below === '.' || below === '|'){
            limitFound = true;
            head = [x, y];
        }
    }
    return {head, x: x, y: y};
}

function spread(startTile, map){
    let x = startTile[0];
    let y = startTile[1];
    const heads = [];
    let keepFilling = true;
    while (keepFilling){
        const rightLimit = findLimit(x, y, 1, map);
        const leftLimit = findLimit(x, y, -1, map);
        let fill = undefined;
        if (rightLimit.head.length === 0 && leftLimit.head.length === 0){
            fill = '~';
        } else {
            if (rightLimit.head.length === 2){
                heads.push(rightLimit.head);
            }
            if (leftLimit.head.length === 2){
                heads.push(leftLimit.head);
            }
            fill = '|';
            keepFilling = false;
        }
        for (let x = leftLimit.x + 1; x < rightLimit.x; x++){
            map[leftLimit.y][x] = fill;
        }

        // console.clear();
        // printMap(map, y);
        // sleep(25);

        y--;
    }
    return heads
}

function pourWater(map){
    let heads = [[500, 1]];
    let newHeads = [];
    while(heads.length > 0){
        heads.forEach((head) => {
            let dropResult = dropWater(head, map)
            if (typeof dropResult === 'object'){
                const brandNewHeads = spread(dropResult, map);
                newHeads.push(...brandNewHeads);
            }
        });
        heads.splice(0, heads.length, ...newHeads)
        newHeads = [];
    }
}

function countWater(map){
    let unsettledWater = 0;
    let settledWater = 0
    let startCounting = false;
    map.forEach((row) => {
        if (row.indexOf('#') !== -1){
            startCounting = true;
        }
        row.forEach((tile) => {
            if (startCounting){
                if (tile === '~'){
                    settledWater++;
                } else if (tile === '|'){
                    unsettledWater++;
                }
            }    
        });
    });
    return {unsettledWater, settledWater}
}

const parsedInput = parseInput(input);
const map = makeMap(parsedInput);
pourWater(map);
const {unsettledWater, settledWater} = countWater(map);
console.log('total water: ', unsettledWater + settledWater);
console.log('settled water: ', settledWater);