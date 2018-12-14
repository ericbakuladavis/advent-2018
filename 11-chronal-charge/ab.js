const input = 8444;
const grid = {};

for (let y = 1; y <= 300; y++){
    grid[y] = {};
    for (let x = 1; x <= 300; x++){
        grid[y][x] = {};
        const cell = grid[y][x];
        cell.rackID = x + 10;
        cell.level = ((cell.rackID * y) + input) * cell.rackID;
        const levelString = cell.level.toString();
        const hundredsDigit = levelString[levelString.length - 3];
        if (hundredsDigit === undefined){
            cell.level = 0;
        } else {
            cell.level = parseInt(hundredsDigit)
        }
        cell.level -= 5;
    }
}

let highestLevelOverall = undefined;
let highestLevelOverallX = undefined;
let highestLevelOveralY = undefined;
let highestLevelOverallSize = undefined;
for (let cornerY = 1; cornerY <= 300; cornerY++){
    for (let cornerX = 1; cornerX <= 300; cornerX++){
        let highestLevel = undefined;
        let highestLevelX = undefined;
        let highestLevelY = undefined;
        let highestLevelSize = undefined;
        for (let size = 1; size + cornerX <= 301 && size + cornerY <= 301; size++){
            let totalLevel = 0;
            for (let y = cornerY; y < cornerY + size; y++){
                for (let x = cornerX; x < cornerX + size; x++){
                    totalLevel += grid[y][x].level
                }
            }
            if (size === 1){
                highestLevel = totalLevel;
                highestLevelX = cornerX;
                highestLevelY = cornerY;
                highestLevelSize = size;
            } else {
                if (totalLevel > highestLevel){
                    highestLevel = totalLevel;
                    highestLevelX = cornerX;
                    highestLevelY = cornerY;
                    highestLevelSize = size;
                }
            }
        }
        if (cornerY === 1 && cornerX === 1){
            highestLevelOverall = highestLevel;
            highestLevelOverallX = highestLevelX;
            highestLevelOveralY = highestLevelY;
            highestLevelOverallSize = highestLevelSize;
        } else {
            if (highestLevel > highestLevelOverall){
                highestLevelOverall = highestLevel;
                highestLevelOverallX = highestLevelX;
                highestLevelOveralY = highestLevelY;
                highestLevelOverallSize = highestLevelSize;
            }
        }
    }
    let number = cornerY / 3;
    console.log( number.toFixed(1) + '% complete. Current highest is ' + highestLevelOverallX + ',' + highestLevelOveralY + ',' + highestLevelOverallSize);
}

console.log('Final highest is: ' + highestLevelOverallX + ',' + highestLevelOveralY + ',' + highestLevelOverallSize)