function parseInstruction(instruction){
    return {A: instruction[1], B: instruction[2], C: instruction[3]}
}

opcodes = {
    addr: function (r, instruction){
        const {A, B, C} = parseInstruction(instruction);
        r[C] = r[A] + r[B];
    },
    addi: function (r, instruction){
        const {A, B, C} = parseInstruction(instruction);
        r[C] = r[A] + B;
    },
    mulr: function (r, instruction){
        const {A, B, C} = parseInstruction(instruction);
        r[C] = r[A] * r[B];
    },
    muli: function (r, instruction){
        const {A, B, C} = parseInstruction(instruction);
        r[C] = r[A] * B;
    },
    banr: function (r, instruction){
        const {A, B, C} = parseInstruction(instruction);
        r[C] = r[A] & r[B];
    },
    bani: function (r, instruction){
        const {A, B, C} = parseInstruction(instruction);
        r[C] = r[A] & B;
    },
    borr: function (r, instruction){
        const {A, B, C} = parseInstruction(instruction);
        r[C] = r[A] | r[B];
    },
    bori: function (r, instruction){
        const {A, B, C} = parseInstruction(instruction);
        r[C] = r[A] | B;
    },
    setr: function (r, instruction){
        const {A, B, C} = parseInstruction(instruction);
        r[C] = r[A];
    },
    seti: function (r, instruction){
        const {A, B, C} = parseInstruction(instruction);
        r[C] = A;
    },
    gtir: function (r, instruction){
        const {A, B, C} = parseInstruction(instruction);
        r[C] = A > r[B] ? 1 : 0;
    },
    gtri: function (r, instruction){
        const {A, B, C} = parseInstruction(instruction);
        r[C] = r[A] > B ? 1 : 0;
    },
    gtrr: function (r, instruction){
        const {A, B, C} = parseInstruction(instruction);
        r[C] = r[A] > r[B] ? 1 : 0;
    },
    eqir: function (r, instruction){
        const {A, B, C} = parseInstruction(instruction);
        r[C] = A === r[B] ? 1 : 0;
    },
    eqri: function (r, instruction){
        const {A, B, C} = parseInstruction(instruction);
        r[C] = r[A] === B ? 1 : 0;
    },
    eqrr: function (r, instruction){
        const {A, B, C} = parseInstruction(instruction);
        r[C] = r[A] === r[B] ? 1 : 0;
    }
}

function runProgram(r, ip, instruction){
    let progress = 0;
    while (input[ip] !== undefined){
        // start speed boost
        if (ip === 11){
            r[5] = 2;
            if (r[3] % r[2] === 0 && r[3] > r[2]){
                r[0] = r[2] + r[0];
            }
            r[1] = r[3] + 1;
            r[5] = 11;
            r[4] = 1;
            ip = 12;
            continue;
        }
        // end speed boost

        // begin progress display 
        if (partTwo && ip === 13){
            const percent = Math.floor((r[2] / r[3]) * 100);
            if (percent > progress){
                console.clear();
                console.log('part 1: ', part1);
                console.log(percent, '%');
                progress = percent;
            }
        }
        // end progress display
        
        instruction = input[ip];
        const opcodeName = instruction[0];
        const opcodeFunction = opcodes[opcodeName];
        r[ipBoundRegister] = ip;
        opcodeFunction(r, instruction);
        ip = r[ipBoundRegister] + 1;   
    }
    return r[0];
}

const fs = require('fs');
const input = fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')
                .split('\n')
                .map((line) => line .split(' ')
                                    .map((elem, index) => {
                                        if (index > 0){
                                            return parseInt(elem);
                                        } else {
                                            return elem;
                                        }
                                    })
                );

const ipBoundRegister = input[0][1];
input.shift();

let r = [0, 0, 0, 0, 0, 0];
let ip = r[ipBoundRegister];
let instruction = input[ip];
let partTwo = false;

const part1 = runProgram(r, ip, instruction);
console.log('part 1: ', part1);

r = [1, 0, 0, 0, 0, 0];
ip = r[ipBoundRegister];
instruction = input[ip];
partTwo = true;

const part2 = runProgram(r, ip, instruction);
console.log('part 2: ', part2);