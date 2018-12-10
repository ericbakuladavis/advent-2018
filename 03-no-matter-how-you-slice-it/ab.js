function parseClaim(claim){
    const nums = claim.match(/\d+/g).map((str) => parseInt(str));
    const id = nums[0];
    const leftEdge = nums[1];
    const topEdge = nums[2];
    const width = nums[3];
    const height = nums [4];
    const rightEdge = leftEdge + width;
    const bottomEdge = topEdge + height;

    return {id, leftEdge, topEdge, rightEdge, bottomEdge}
}

const fs = require('fs');
const input =   fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')
                .split('\n');

let fabric = [];
for (let i = 0; i < 1000; i++){
    fabric.push([]);
    for (let k = 0; k < 1000; k++){
        fabric[i].push('.');
    }
}

let overlappedSpots = 0;

input.forEach((claim) => {
    const {id, leftEdge, topEdge, rightEdge, bottomEdge} = parseClaim(claim);

    // make sure the fabric is wide enough to accomodate the claim
    if (rightEdge > fabric[0].length){
        fabric.forEach((row) => {
            while (rightEdge > row.length){
                row.push('.');
            }
        });
    }

    // make sure the fabric is tall enough to accomodate the claim
    while (bottomEdge > fabric.length){
        fabric.push([]);
        for (let i = 0; i < fabric[0].length; i++){
            fabric[fabric.length - 1].push('.');
        }
    }
    
    // mark out the claim and count overlapped spots

    for (let y = topEdge; y < bottomEdge; y++){
        for (let x = leftEdge; x < rightEdge; x++){
            const currentCharacter = fabric[y][x];
            if (currentCharacter === '.'){
                fabric[y][x] = id;
            } else if (typeof currentCharacter === 'number'){
                fabric[y][x] = 'X';
                overlappedSpots++;
            }
        }
    }
});

// find the claim that does not overlap

for (let i = 0; i < input.length; i++){
    const claim = input[i];
    const {id, leftEdge, topEdge, rightEdge, bottomEdge} = parseClaim(claim);
    let couldBeTheNonOverlapper = true;
    for (let y = topEdge; y < bottomEdge; y++){
        for (let x = leftEdge; x < rightEdge; x++){
            const currentCharacter = fabric[y][x];
            if (currentCharacter !== id){
                couldBeTheNonOverlapper = false;
                break;
            }
        }
        if (couldBeTheNonOverlapper === false){
            break;
        }
    }
    if (couldBeTheNonOverlapper === true){
        console.log(id); // 574
        break;
    }
}

console.log(overlappedSpots); // 116140