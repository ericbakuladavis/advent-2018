class Cart {
    constructor(x, y, direction){
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.possibleDirections = "^>v<";
        this.directionIndex = this.possibleDirections.indexOf(this.direction);
        this.nextTurn = 'left';
        this.crashed = false;
    }

    turn(turnDirection){
        if (turnDirection === 'left'){
            this.directionIndex += 3;            
        } else if (turnDirection === 'right'){
            this.directionIndex++;
        }
        this.directionIndex = this.directionIndex % 4;
        this.direction = this.possibleDirections[this.directionIndex];
    }

    move(){
        switch(this.direction) {
            case '^':
              this.y--;
              break;
            case '>':
              this.x++;
              break;
            case 'v':
              this.y++;
              break;
            case '<':
              this.x--;
              break;  
        }
        this.evaluateTrack();
    }

    evaluateTrack(){
        const symbol = input[this.y][this.x];
        if (symbol === "\\"){
            if (this.direction === "<" || this.direction === ">"){
                this.turn('right');
            } else {
                this.turn('left');
            }
        } else if (symbol === "/"){
            if (this.direction === "<" || this.direction === ">"){
                this.turn('left');
            } else {
                this.turn('right');
            }
        } else if (symbol === "+"){
            this.turn(this.nextTurn);
            switch(this.nextTurn) {
                case 'left':
                  this.nextTurn = 'straight';
                  break;
                case 'straight':
                  this.nextTurn = 'right';
                  break;
                case 'right':
                  this.nextTurn = 'left';
                  break;
            }
        }
    }
}

function catalogCarts(input){
    const carts = [];
    const cartStates = "^>v<";
    for (let y = 0; y < input.length; y++){
        for (x = 0; x < input[y].length; x++){
            const symbol = input[y][x];
            if (cartStates.includes(symbol)){
                carts.push(new Cart(x, y, symbol))
            }
        }
    }
    return carts;
}

function sortCarts(carts){
    carts.sort((a, b) => {
        if (a.y > b.y){
            return 1;
        } else if (a.y < b.y){
            return -1;
        } else {
            if (a.x > b.x){
                return 1;
            } else if (a.x < b.x){
                return -1;
            }
        }
    });
}

function resolveCrash(cartInQuestion, carts){
    let cartsAtLocation = 0;
    carts.forEach((cart) => {
        if (cart.x === cartInQuestion.x && cart.y === cartInQuestion.y && cart.crashed === false){
            cartsAtLocation++;
        }
    });
    if (cartsAtLocation > 1){
        carts.forEach((cart) => {
            if (cart.x === cartInQuestion.x && cart.y === cartInQuestion.y && cart.crashed === false){
                cart.crashed = true;
            }
        });
    }
}

function simulateCarts(carts){
    const notableEvents = [];
    let stop = false;
    while (stop === false){
        sortCarts(carts);
        let countCrashes = false;
        carts.forEach((cart) => {
            if (cart.crashed === false){
                cart.move();
                resolveCrash(cart, carts)
                if (cart.crashed === true){
                    countCrashes = true;
                }
            }
        });
        
        // if we just had a crash...
        if (countCrashes === true){
            let crashedCarts = 0;
            carts.forEach((cart) => {
                if (cart.crashed === true){
                    crashedCarts++
                }
            });
            // if it's the first crash, note it
            if (crashedCarts === 2){
                carts.forEach((cart) => {
                    if (cart.crashed === true){
                        notableEvents.push([cart.x, cart.y])
                    }
                });
            }
            // if it's the last crash, top the simulation
            if (crashedCarts === carts.length - 1){
                stop = true;
            }
        }
    }

    // note the location of the remaining cart
    for (let i = 0; i < carts.length; i++){
        const cart = carts[i];
        if (cart.crashed === false){
            notableEvents.push([cart.x, cart.y])
            return notableEvents;
        }
    }
}
const fs = require('fs');
const input =   fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')
                .split('\n');

let carts = catalogCarts(input);
const notableEvents = simulateCarts(carts);

console.log(notableEvents[1][0] + ',' + notableEvents[1][1]);
console.log(notableEvents[2][0] + ',' + notableEvents[2][1]);