const fs = require('fs');
const input =   fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')
                .split('\n')
                .sort();

const guards = {}; 
let currentGuardID = undefined;

// populate the guards object with sleep data

for (let i = 0; i < input.length; i++){
    const line = input[i];
    if (line[19] === 'G'){
        const currentGuardIDArr = line.match(/#\d+/);
        currentGuardID = currentGuardIDArr[0];
        continue;
    }
    if (line[19] === 'f'){
        if (!guards.hasOwnProperty(currentGuardID)){
            guards[currentGuardID] = {};
            guards[currentGuardID].totalSleep = 0;
            guards[currentGuardID].minutes = {};
            for (let i = 0; i < 60; i++){
                guards[currentGuardID].minutes[i] = 0;
            }
        }
        const fellAsleep = parseInt(line.slice(15, 17));
        const wokeUp = parseInt(input[i +1].slice(15, 17));
        const timeAsleep = wokeUp - fellAsleep;
        guards[currentGuardID].totalSleep += timeAsleep;
        for (let i = fellAsleep; i < wokeUp; i++){
            guards[currentGuardID].minutes[i] += 1
        }
        i++;
    }
}

// loop through the guards

sleepiestGuard = undefined;
maxSleepTime = 0;
overallSleepiestMinute = undefined;
overallMaxMinuteCount = 0;
guardWithTheOverallSleepiestMinute = undefined;

for (guardID in guards){
    
    // find the sleepiest guard
    
    sleepTime = guards[guardID].totalSleep;
    if (sleepTime > maxSleepTime){
       sleepiestGuard = guardID;
       maxSleepTime = sleepTime; 
    }

    // find the sleepiest minute for each guard

    sleepiestMinute = undefined;
    maxMinuteCount = 0;
    for (minute in guards[guardID].minutes){
        minuteCount = guards[guardID].minutes[minute];
        if (minuteCount > maxMinuteCount){
            sleepiestMinute = minute;
            maxMinuteCount = minuteCount;
        }
    }
    
    guards[guardID].sleepiestMinute = sleepiestMinute;

    // find the sleepiest minute of any guard

    if (maxMinuteCount > overallMaxMinuteCount){
        overallMaxMinuteCount = maxMinuteCount;
        overallSleepiestMinute = sleepiestMinute;
        guardWithTheOverallSleepiestMinute = guardID;
    }
    
}

// multiply these to get answer to part 1

// sleepiest guard
console.log(sleepiestGuard); // #3371

// sleepiest minute of sleepiest guard
console.log(guards[sleepiestGuard].sleepiestMinute); // 39



// multiply these to get answer to part 2

// guard with the sleepiest minute of any guard
console.log(guardWithTheOverallSleepiestMinute); // #1901

// sleepiest minute of any guard 
console.log(overallSleepiestMinute); // 51