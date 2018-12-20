function countMatchingOpcodes(before, instruction, after, opcodeCounts){
    let matchingOpcodes = 0;
    if (!opcodeCounts.hasOwnProperty(instruction[0])){
        opcodeCounts[instruction[0]] = {};
    }
    for (opcodeName in opcodes) {
        const beforeCopy = before.slice();
        opcodes[opcodeName](beforeCopy, instruction);
        if (beforeCopy.join('') === after.join('')){
            matchingOpcodes++;
            if(opcodeCounts[instruction[0]].hasOwnProperty(opcodeName)){
                opcodeCounts[instruction[0]][opcodeName]++;
            } else {
                opcodeCounts[instruction[0]][opcodeName] = 1;
            }
        }
    }
    return matchingOpcodes;
}

function countSpecialSamples(samples){
    let specialSamples = 0;
    const opcodeCounts = {};
    samples.forEach((sample) => {
        const before = sample[0];
        const instruction = sample[1];
        const after = sample[2];
        const matchingOpcodes = countMatchingOpcodes(before, instruction, after, opcodeCounts);
        if (matchingOpcodes >= 3){
            specialSamples++;
        }
    });
    return {specialSamples, opcodeCounts};
}

function assignNumbers(opcodeCounts){
    const numberedOpcodes = new Set();
    while (numberedOpcodes.size < 16){
        for (number in opcodeCounts){
            const obj = opcodeCounts[number];
            let hiCount = 0;
            for (opcode in obj){
                const count = obj[opcode];
                if (count > hiCount){
                    hiCount = count;
                }
            }
            for (opcode in obj){
                if (obj[opcode] !== hiCount || (numberedOpcodes.has(opcode) && Object.keys(obj).length > 1)){
                    delete obj[opcode];
                }
            }
            const keysArray = Object.keys(obj);
            if (keysArray.length === 1){
                numberedOpcodes.add(keysArray[0]);         
            }
        }
    }
    const opcodeNumbers = {};
    for (number in opcodeCounts){
        const obj = opcodeCounts[number];
        opcodeNumbers[number] = Object.keys(obj)[0];
    }
    return opcodeNumbers;
}

function runProgram(program){
    registers = [0, 0, 0, 0]
    program.forEach((instruction) => {
        const opcodeNumber = instruction[0];
        const opcodeName = opcodeNumbers[opcodeNumber];
        const opcodeFunction = opcodes[opcodeName];
        opcodeFunction(registers, instruction);
    });
    return registers[0];
}

function parseInstruction(instruction){
    return {A: instruction[1], B: instruction[2], C: instruction[3]}
}

opcodes = {
    addr: function (registers, instruction){
        const {A, B, C} = parseInstruction(instruction);
        registers[C] = registers[A] + registers[B];
    },

    addi: function (registers, instruction){
        const {A, B, C} = parseInstruction(instruction);
        registers[C] = registers[A] + B;
    },

    mulr: function (registers, instruction){
        const {A, B, C} = parseInstruction(instruction);
        registers[C] = registers[A] * registers[B];
    },

    muli: function (registers, instruction){
        const {A, B, C} = parseInstruction(instruction);
        registers[C] = registers[A] * B;
    },

    banr: function (registers, instruction){
        const {A, B, C} = parseInstruction(instruction);
        registers[C] = registers[A] & registers[B];
    },

    bani: function (registers, instruction){
        const {A, B, C} = parseInstruction(instruction);
        registers[C] = registers[A] & B;
    },

    borr: function (registers, instruction){
        const {A, B, C} = parseInstruction(instruction);
        registers[C] = registers[A] | registers[B];
    },

    bori: function (registers, instruction){
        const {A, B, C} = parseInstruction(instruction);
        registers[C] = registers[A] | B;
    },

    setr: function (registers, instruction){
        const {A, B, C} = parseInstruction(instruction);
        registers[C] = registers[A];
    },

    seti: function (registers, instruction){
        const {A, B, C} = parseInstruction(instruction);
        registers[C] = A;
    },

    gtir: function (registers, instruction){
        const {A, B, C} = parseInstruction(instruction);
        registers[C] = A > registers[B] ? 1 : 0;
    },

    gtri: function (registers, instruction){
        const {A, B, C} = parseInstruction(instruction);
        registers[C] = registers[A] > B ? 1 : 0;
    },

    gtrr: function (registers, instruction){
        const {A, B, C} = parseInstruction(instruction);
        registers[C] = registers[A] > registers[B] ? 1 : 0;
    },

    eqir: function (registers, instruction){
        const {A, B, C} = parseInstruction(instruction);
        registers[C] = A === registers[B] ? 1 : 0;
    },

    eqri: function (registers, instruction){
        const {A, B, C} = parseInstruction(instruction);
        registers[C] = registers[A] === B ? 1 : 0;
    },

    eqrr: function (registers, instruction){
        const {A, B, C} = parseInstruction(instruction);
        registers[C] = registers[A] === registers[B] ? 1 : 0;
    }
}

const fs = require('fs');
const samples = fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')
                .split('\n\n')
                .map((line) =>  line 
                                .split('\n')
                                .map((line) =>  line
                                                .match(/\d+/g)
                                                .map((string) => parseInt(string))
                                )
                );

const {specialSamples, opcodeCounts} = countSpecialSamples(samples);
console.log('part1: ', specialSamples);
const opcodeNumbers = assignNumbers(opcodeCounts);

const program = fs
                .readFileSync(`${__dirname}/input2.txt`, 'utf8')
                .split('\n')
                .map((line) => line .match(/\d+/g)
                                    .map((string) => parseInt(string))
                );

const register0 = runProgram(program);
console.log('part2: ', register0);