function findDistance(pointA, pointB){
    return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y)
}

function findClosestCoordinate(point){
    const distances = input.map((coordinateSet) => {
        return findDistance(point, coordinateSet);
    });
    const minDistance = Math.min(...distances);
    let occurancesOfMinDistance = 0;
    for (let i = 0; i < distances.length; i++){
        const distance = distances[i];
        if (distance === minDistance){
            occurancesOfMinDistance++;
            if (occurancesOfMinDistance > 1){
                return '.';
            }
        }
    }
    return distances.indexOf(minDistance);
}

function isDistanceSumLessThan10000(point){
    let distanceSum = 0;
    for (let i = 0; i < input.length; i++){
        const coordinateSet = input[i];
        distanceSum += findDistance(point, coordinateSet);
        if (distanceSum >= 10000){
            return false;
        }
    }
    return true;
}

const fs = require('fs');
const input =   fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')
                .split('\n')
                .map((line) => {
                    const coordinateSetAsArrayOfStrings = line.split(', ');
                    const coordinateSetAsArrayOfNumbers = coordinateSetAsArrayOfStrings.map((string) => parseInt(string));
                    const coordinateSet = {};
                    coordinateSet.x = coordinateSetAsArrayOfNumbers[0];
                    coordinateSet.y = coordinateSetAsArrayOfNumbers[1];
                    return coordinateSet;
                });

const firstX = input[0].x;
const firstY = input[0].y;
let maxX = firstX;
let maxY = firstY;
let minX = firstX;
let minY = firstY;

input.forEach((coordinateSet) => {
    const x = coordinateSet.x;
    const y = coordinateSet.y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
});        

const coordinatesWithInfiniteAreas = new Set();

input.forEach((coordinateSet, index) => {
    const x = coordinateSet.x;
    const y = coordinateSet.y;
    if (x === maxX || x === minX || y === maxY || y === minY){
        coordinatesWithInfiniteAreas.add(index);
    } 
});

const areas = {};

for (let y = minY; y <= maxY; y++){
    for (let x = minX; x <= maxX; x++){
        const closestCoordinate = findClosestCoordinate({x,y});
        if (areas.hasOwnProperty(closestCoordinate)){
            areas[closestCoordinate]++;
        } else {
            areas[closestCoordinate] = 1;
        }
    }
}

let maxArea = 0;
for (coordinate in areas){
    const area = areas[coordinate];
    if (area > maxArea && !coordinatesWithInfiniteAreas.has(coordinate)){
        maxArea = area;
    }
}

console.log(maxArea); // 3238

let safeRegionArea = 0;
for (let y = minY; y <= maxY; y++){
    for (let x = minX; x <= maxX; x++){
       if (isDistanceSumLessThan10000({x,y})){
            safeRegionArea++;
       } 
    }
}

console.log(safeRegionArea);