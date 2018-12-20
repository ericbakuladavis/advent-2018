class Unit {
    constructor(type, x, y, id, ap){
        this.type = type;
        this.x = x;
        this.y = y;
        this.hp = 200;
        this.id = id;
        this.alive = true;
        if (this.type === 'E'){
            this.enemy = 'G';
            this.ap = ap
        } else {
            this.enemy = 'E';
            this.ap = 3;
        }
    }

    beginTurn(input, units) {
        const attackResult = this.considerAttack(input, units);
        if (attackResult === false){
            return this.considerMove(input, units);
        }      
    }

    considerAttack(input, units){
        const attackOptions = []
        units.forEach((unit) => {
            if (unit.type === this.enemy && unit.alive === true){
                if (Math.abs(unit.x - this.x) + Math.abs(unit.y - this.y) === 1){
                    attackOptions.push(unit);
                }
            }
        });
        if (attackOptions.length === 0){
            return false;
        } else {
            let bestTarget = undefined;
            attackOptions.forEach((unit) => {
                if (bestTarget === undefined){
                    bestTarget = unit;
                } else {
                    if (unit.hp < bestTarget.hp){
                        bestTarget = unit;
                    } else if (unit.hp === bestTarget.hp && areInReadingOrder(unit, bestTarget)){
                        bestTarget = unit;
                    }
                }
            });
            this.attack(bestTarget, input, units);
            return true;
        }
    }

    attack(target, input){
        target.hp -= this.ap;
        if (target.hp <= 0){
            input[target.y][target.x] = '.';
            target.alive = false;
        }
    }

    considerMove(input, units) {
        const targetCells = [];
        let enemyTeamStatus = false;
        units.forEach((unit) => {
            if (unit.type === this.enemy && unit.alive === true){
                enemyTeamStatus = true;
                const surroundingCells = this.getSurroundingCells({x: unit.x, y: unit.y});
                surroundingCells.forEach((cell) => {
                    if (input[cell.y][cell.x] === '.'){
                        targetCells.push(cell);
                    }
                });
            }
        });
        if (targetCells.length === 0){
            return enemyTeamStatus;
        } else {
            const inputCopy = JSON.parse(JSON.stringify(input));
            const nearestReachableTargets = this.findReachableTargets(inputCopy, targetCells, {x: this.x, y: this.y});
            if (nearestReachableTargets.length > 0){
                setInReadingOrder(nearestReachableTargets);
                const bestTarget = nearestReachableTargets[0];
                const possibleMoves = this.getPossibleMoves(bestTarget, inputCopy)
                setInReadingOrder(possibleMoves);
                this.moveTo(possibleMoves[0], input);
                this.considerAttack(input, units);
                return true;
            }
        }
    }

    doesNotContain(arrayOfCells, cell){
        return arrayOfCells.every((cellInArray) => {
            return (cellInArray.y !== cell.y || cellInArray.x !== cell.x)
        });
    }

    getPossibleMoves(end, inputCopy){
        let step = inputCopy[end.y][end.x];
        let validCells = [end];
        while (step > 1){
            const newValidCells = [];
            validCells.forEach((cell) => {
                const surroundingCells = this.getSurroundingCells(cell);
                surroundingCells.forEach((cell) => {
                    if (inputCopy[cell.y][cell.x] === step - 1 && this.doesNotContain(newValidCells, cell)){
                        newValidCells.push(cell);
                    }
                });
            });
            validCells = newValidCells;
            step--;
        }
        return validCells;
    }

    layNumber(inputCopy, cell, step, newNodes){
        if (inputCopy[cell.y][cell.x] === '.'){
            inputCopy[cell.y][cell.x] = step;
            newNodes.push({x: cell.x, y: cell.y})
        }
    }

    getSurroundingCells(cell){
        const surroundingCells = []
        surroundingCells.push({x: cell.x + 1, y: cell.y})
        surroundingCells.push({x: cell.x - 1, y: cell.y})
        surroundingCells.push({x :cell.x, y: cell.y + 1})
        surroundingCells.push({x: cell.x, y: cell.y - 1})
        return surroundingCells;
    }

    findReachableTargets(inputCopy, targetCells, originCell){
        let end = false;
        let step = 1;
        let nodes = [originCell];
        let nearestReachableTargets = [];
        while (end === false){
            let newNodes = []
            nodes.forEach((node) => {
                const surroundingCells = this.getSurroundingCells(node);
                surroundingCells.forEach((cell) => {
                    this.layNumber(inputCopy, cell, step, newNodes)
                });
            });
            if (newNodes.length === 0){
                break;
            }
            newNodes.forEach((newNode) => {
                targetCells.forEach((cell) => {
                    if (cell.x === newNode.x && cell.y === newNode.y){
                        nearestReachableTargets.push(cell);
                        end = true;
                    }
                });
            });
            nodes = newNodes;
            step++;
        }
        return nearestReachableTargets
    }

    moveTo(destination, input){
        input[this.y][this.x] = '.';
        this.x = destination.x;
        this.y = destination.y;
        input[this.y][this.x] = this.type;
    }
}

function catalogUnits(input, ap){
    const units = [];
    let id = 0;
    for (let y = 0; y < input.length; y++){
        for (let x = 0; x < input[y].length; x++){
            const symbol = input[y][x];
            if (symbol === 'E' || symbol === 'G'){
                units.push (new Unit(symbol, x, y, id, ap));
                id++;
            }
        }
    }
    return units;
}

function areInReadingOrder(cellA, cellB){
    if (cellA.y < cellB.y) return true;
    if (cellA.y > cellB.y) return false;
    if (cellA.x < cellB.x) return true;
    if (cellA.x > cellB.x) return false;
}

function setInReadingOrder(array){
    array.sort((a, b) => {
        if (areInReadingOrder(a, b)){
            return - 1;
        }
        return 1;
    });
}

function battle(input, units){
    let roundsCompleted = 0;
    let  continueBattle = true;
    while (continueBattle){
        setInReadingOrder(units);
        units.forEach((unit) => {
            if (unit.alive === true){
                const enemyTeamStatus = unit.beginTurn(input, units);
                if (enemyTeamStatus === false){
                    continueBattle = false;
                }
            }   
        });
        units = units.filter((unit) => {
            return unit.alive === true;
        });
        if (continueBattle){
            roundsCompleted++;
        }
    }
    return {roundsCompleted, units}
}

function countElves(units){
    let elves = 0;
    units.forEach((unit) => {
        if (unit.type === 'E' && unit.alive === true){
            elves++;
        }
    });
    return elves;
}

function countHp(units){
    let totalHp = 0;
    units.forEach((unit) => {
        totalHp += unit.hp;
    });
    return totalHp;
}

function findMinAp(input){
    let ap = 2;
    let outcome1 = undefined;
    let outcome2 = undefined;
    while (ap < 200){
        ap++;
        const inputCopy = JSON.parse(JSON.stringify(input));
        const units = catalogUnits(inputCopy, ap);
        const elvesBefore = countElves(units);
        const result = battle(inputCopy, units, ap);
        const roundsCompleted = result.roundsCompleted;
        const remainingUnits = result.units
        const elvesAfter = countElves(remainingUnits);
        if (ap === 3){
            const remainingHp = countHp(remainingUnits);
            outcome1 = roundsCompleted * remainingHp
        }
        if (elvesBefore === elvesAfter){
            const remainingHp = countHp(remainingUnits);
            outcome2 = roundsCompleted * remainingHp;
            return {outcome1, outcome2};
        }
    }
}
 
const fs = require('fs');
const input =   fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')
                .split('\n')
                .map(row => row.split(''));

const {outcome1, outcome2} = findMinAp(input);
console.log('outcome 1: ', outcome1);
console.log('outcome 2: ', outcome2);

// function printMap(input, units){
//     input.forEach((row, rowIndex) => {
//         let printThis = '';
//         row.forEach((cell, cellIndex) => {
//             if (cell === 'G' || cell === 'E'){
//                 units.forEach((unit) => {
//                     if (unit.x === cellIndex && unit.y === rowIndex){
//                         printThis += unit.type + unit.hp + ' ';
//                     }
//                 });
//             }
//         });
//         console.log(row.join(''), printThis);
//     });
// }

// function sleep(milliseconds) {
//     var start = new Date().getTime();
//     for (var i = 0; i < 1e7; i++) {
//       if ((new Date().getTime() - start) > milliseconds){
//         break;
//       }
//     }
//   }