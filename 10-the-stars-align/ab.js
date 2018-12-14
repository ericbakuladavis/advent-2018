const fs = require('fs');
const input =   fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')
                .split('\n')
                .map((line) => {
                    let arr = line.match(/.\d+/g);
                    return arr.map((string) => parseInt(string)).join(',');
                })
                .join('|');
                
console.log(input)

// I didnt know how to import input.txt into the script in canvas.html.
// So, I logged the input, as a one-line string, to the console, and copy-pasted it in.