const input = 236021;

//// PART 1 ONLY

let scoreboard = [3,7];
let elf1Position = 0;
let elf2Position = 1;

while (scoreboard.length <= input + 10){
    const elf1Recipe = scoreboard[elf1Position];
    const elf2Recipe = scoreboard[elf2Position]; 
    const newRecipe = elf1Recipe + elf2Recipe;
    if (newRecipe >= 10){
        scoreboard.push(1);
        scoreboard.push(newRecipe - 10);
    } else {
        scoreboard.push(newRecipe);
    }
    elf1Position = (elf1Position + elf1Recipe + 1) % scoreboard.length;
    elf2Position = (elf2Position + elf2Recipe + 1) % scoreboard.length;
}
console.log(scoreboard.slice(input, input + 10).join(''))