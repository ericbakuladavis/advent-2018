function playGame(numberOfPlayers, lastMarble){
    const circle = [0, 1];
    const playerScores = {};
    let currentPlayer = 2;
    let currentMarble = 1;
    let currentMarbleIndex = 1;
    while (currentMarble < lastMarble){
        let newMarble = currentMarble + 1;
        if (newMarble % 23 === 0){
            if (!playerScores.hasOwnProperty(currentPlayer)){
                playerScores[currentPlayer] = 0;
            }
            let marbleToRemoveIndex = undefined;
            if (currentMarbleIndex - 7 < 0){
                marbleToRemoveIndex = (currentMarbleIndex + circle.length - 7) % circle.length;
            } else {
                marbleToRemoveIndex = currentMarbleIndex - 7;
            }
            let marbleToRemove = circle[marbleToRemoveIndex];
            circle.splice(marbleToRemoveIndex, 1);
            playerScores[currentPlayer] += (marbleToRemove + newMarble);
            currentMarbleIndex = marbleToRemoveIndex;
        } else {
            let newMarbleIndex = undefined;
            if (currentMarbleIndex + 2 === circle.length){
                newMarbleIndex = currentMarbleIndex + 2;
                circle.push(newMarble);
            } else {
                newMarbleIndex = (currentMarbleIndex + 2) % circle.length;
                circle.splice(newMarbleIndex, 0, newMarble)
            }
            currentMarbleIndex = newMarbleIndex;
        }
        currentPlayer = ((++currentPlayer - 1) % numberOfPlayers) + 1
        currentMarble++;
    }
    const scoresArray = Object.values(playerScores);
    return Math.max(...scoresArray);
}

const fs = require('fs');
const input =   fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')
                .match(/\d+/g)
                .map((string) => parseInt(string));

let numberOfPlayers = input[0];
let lastMarble = input[1];

let highScore = playGame(numberOfPlayers, lastMarble);
console.log(highScore); // 370210

lastMarble = input[1] * 100;

console.log('This is gonna take awhile...');
highScore = playGame(numberOfPlayers, lastMarble);
console.log(highScore); // 3101176548