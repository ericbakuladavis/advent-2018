const fs = require('fs');
const input =   fs
                .readFileSync(`${__dirname}/input.txt`, 'utf8')
                .split(' ')
                .map((string) => parseInt(string));

let tree = {};                
let sumOfAllMetadata = 0;

function valueOfNode(node){
    node.value = 0;
    if (!node.hasOwnProperty('children')){
        node.metadata.forEach((metadatum) => {
            node.value += metadatum;
        });
        return node.value;
    }

    node.metadata.forEach((metadatum) => {
        node.children.forEach((child) => {
            if (child.number === metadatum){
                node.value += valueOfNode(child);
            }
        });
    });
    return node.value;
}

function addMetadataToSum(metadata){
    metadata.forEach((metadatum) => {
        sumOfAllMetadata += metadatum;
    });
}

function addInfoToTree(index, parentIndex, number, metadata){
    
    if (!tree.hasOwnProperty(index)){
        tree[index] = {};
    }
    tree[index].index = index;
    tree[index].number = number;
    tree[index].metadata = metadata;
    if (parentIndex !== undefined){
        if (!tree.hasOwnProperty(parentIndex)){
            tree[parentIndex] = {};
            tree[parentIndex].children = [];
        }
        tree[index].parent = tree[parentIndex];
        tree[parentIndex].children.push(tree[index]);
    }
}

function parseLicenseFile(numberOfNodesInLitter, index, parentIndex){
    if (numberOfNodesInLitter === 0){
        return 0;
    }
    let totalSizeOfLitter = 0;
    for (let i = 0; i < numberOfNodesInLitter; i++){
        const numberOfChildren = input[index];
        const numberOfMetadata = input[index + 1];
        const sizeOfNode = 2 + numberOfMetadata + parseLicenseFile(numberOfChildren, index + 2, index);
        const metadata = input.slice(index + sizeOfNode - numberOfMetadata, index + sizeOfNode);
        const number = i + 1;
        addInfoToTree(index, parentIndex, number, metadata);
        addMetadataToSum(metadata);

        totalSizeOfLitter += sizeOfNode;
        index += sizeOfNode;
    }
    return totalSizeOfLitter;
}

parseLicenseFile(1, 0);
const valueOfRootNode = valueOfNode(tree[0]);

console.log(sumOfAllMetadata); // 40908
console.log(valueOfRootNode); // 25910