function giveAssignments(time, workers, available, idleWorkers){
    while (available.length > 0 && idleWorkers > 0){
        const currentAssignment = available[0];
        for (let i = 0; i < workers.length && available.length > 0; i++){
            if (workers[i].status === 'idle'){
                workers[i].receiveAssignment(currentAssignment, time, time + alphabet.indexOf(currentAssignment) + 60)
                idleWorkers--;
                available.shift();
                break;
            }
        }
    }
    return idleWorkers;
}

function generateWorkers(workers){
    class Worker {
        constructor(){
            this.status = 'idle';
        }
        receiveAssignment(step, startTime, endTime){
            this.currentStep = step;
            this.startTime = startTime;
            this.endTime = endTime;
            this.status = 'busy';
        }
        finishAssignment(){
            this.currentStep = undefined;
            this.startTime = undefined;
            this.endTime = undefined;
            this.status = 'idle';
        }
    }
    for (let i = 0; i < 5  ; i++){
        const worker = new Worker();
        workers.push(worker);
    }
}

function assembleWithTeam(list, numberOfSteps){
    const workers = [];
    generateWorkers(workers);
    let idleWorkers = workers.length;
    let order = '';
    const available = [];
    generateInitialAvailableSteps(list, available);
    // in every second...
    let time = 0;
    while (order.length < numberOfSteps){
        // give assignments
        idleWorkers = giveAssignments(time, workers, available, idleWorkers);
        // check on each worker
        workers.forEach((worker) => {
            // if a worker finishes a step...
            if (worker.status === 'busy' && worker.endTime === time){
                // add the step to the order of steps list
                order += worker.currentStep;
                // mark the step as complete
                list[worker.currentStep].status = 'complete';
                // generate new available steps
                generateNewAvailableSteps(list, available, worker.currentStep);
                // reset the worker
                worker.finishAssignment();
                // add one to the number of idle workers
                idleWorkers++;
            }
        });
        time++;
    }
    return time;
}

function generateNewAvailableSteps(list, available, currentStep){
    list[currentStep].requiredBy.forEach((requiredByStep) => {
        const isAvailable = requiredByStep.requires.every((requiresStep) => {
            if (requiresStep.status === 'complete'){
                return true;
            }
        });
        if (isAvailable === true){
            available.push(requiredByStep.name);
        }
    });
    available.sort();
}

function generateInitialAvailableSteps(list, available){
    for (step in list){
        if (list[step].requires.length === 0){
            available.push(step);
        }
    }
    available.sort();
}

function assembleOrder(list, numberOfSteps){
    let order = '';
    const available = [];
    generateInitialAvailableSteps(list, available);
    while (order.length < numberOfSteps){
        const currentStep = available[0]
        order += currentStep;
        list[currentStep].status = 'complete';
        available.shift();
        generateNewAvailableSteps(list, available, currentStep);
    }
    return order;
}

function buildList(input){
    const list = {};
    input.forEach((line) => {
        const step = line[36];
        const requirement = line[5];
        if (!list.hasOwnProperty(step)){
            list[step] = {};
            list[step].name = step;
            list[step].requires = [];
            list[step].requiredBy = [];
            list[step].status = 'incomplete';
        }
        if (!list.hasOwnProperty(requirement)){
            list[requirement] = {};
            list[requirement].name = requirement;
            list[requirement].requires = [];
            list[requirement].requiredBy = [];
            list[requirement].status = 'incomplete';
        }
        list[step].requires.push(list[requirement]);
        list[requirement].requiredBy.push(list[step]);
    });
    return list;
}

const fs = require('fs');
const input =   fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')
                .split('\n')

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

let list = buildList(input);
const numberOfSteps = Object.keys(list).length;

const order = assembleOrder(list, numberOfSteps);
console.log(order); // BDHNEGOLQASVWYPXUMZJIKRTFC

list = buildList(input);
const secondsRequired = assembleWithTeam(list, numberOfSteps);
console.log(secondsRequired); // 1107
