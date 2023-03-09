const fs = require('fs');
let tps = []
let amountOfMvccrc = []

let skew;
let probOfFunc;
let BatchSize;
let hotAccount;
let functionType;
let readType;
let writeType;
let type;

// skew;
// probOfFunc;
BatchSize=100;
hotAccount='sender';
functionType='1';
readType='normal';
writeType='txQueue';
type=1;

for(probOfFunc=5;probOfFunc<100;probOfFunc=probOfFunc+45){
    tps = []
    amountOfMvccrc = []
    for(skew=0;skew<=2;skew=skew+0.2){
        skew=skew.toFixed(1);
        fs.readdirSync('./data').forEach(folderName => {
            if(folderName.includes(`skew=${skew}-probOfFunc=${probOfFunc}-BatchSize=${BatchSize}-amountOfAccount=10000-hotAccount=${hotAccount}-functionType=${functionType}-readType=${readType}-writeType=${writeType}-type=${type}`)){
                // console.log(`./data/${folderName}/total.txt`);
                var data = fs.readFileSync(`./data/${folderName}/total.txt`, "utf8"); 
                data = JSON.parse(data);
                if(data.amount!=5){
                    console.log(`./data/${folderName}/total.txt 此檔案有問題未五次`);
                } else {
                    tps.push(parseFloat(data.tps.toFixed(2)));
                    amountOfMvccrc.push(data.amountOfMvccrc);
                }
            } 
        });
        skew=parseFloat(skew);
    }

    console.log(tps);
    console.log(amountOfMvccrc);
}

BatchSize=100;
hotAccount='sender';
functionType='1';
readType='normal';
writeType='normal';
type=1;

for(probOfFunc=5;probOfFunc<100;probOfFunc=probOfFunc+45){
    tps = []
    amountOfMvccrc = []
    for(skew=0;skew<=2;skew=skew+0.2){
        skew=skew.toFixed(1);
        fs.readdirSync('./data').forEach(folderName => {
            if(folderName.includes(`skew=${skew}-probOfFunc=${probOfFunc}-BatchSize=${BatchSize}-amountOfAccount=10000-hotAccount=${hotAccount}-functionType=${functionType}-readType=${readType}-writeType=${writeType}-type=${type}`)){
                // console.log(`./data/${folderName}/total.txt`);
                var data = fs.readFileSync(`./data/${folderName}/total.txt`, "utf8"); 
                data = JSON.parse(data);
                if(data.amount!=5){
                    console.log(`./data/${folderName}/total.txt 此檔案有問題未五次`);
                } else {
                    tps.push(parseFloat(data.tps.toFixed(2)));
                    amountOfMvccrc.push(data.amountOfMvccrc);
                }
            } 
        });
        skew=parseFloat(skew);
    }

    console.log(tps);
    console.log(amountOfMvccrc);
}

