const { Transaction } = require("fabric-network");
const { Console } = require("console");
const fs = require("fs");

let timeOfFile = Date.now();
const folderName = process.env.folderName;

const logOfTransaction = new Console({
    stdout: fs.createWriteStream(`data/${folderName}/${timeOfFile}_logOfTransaction`),
});

const logOfResult = new Console({
    stdout: fs.createWriteStream(`data/${folderName}/${timeOfFile}_logOfResult`),
});

var oneByOneQueue = {};
var amountOfPendingTransaction = 0;
var amountOfErrorOfTransaction = 0;
var amountOfCompleteTransaction = 0;
var upperOfPendingTransaction = 100;
var normalQueue = [];
var oneByOneLock = {};
var lastTimeOfMinusUpperOfPendingTransaction = 0;
var timeIntervalOfMinusUpperOfPendingTransaction = 5000;
var amountOfMvccrc = 0;
var ratioOfFuncOfMvccrc = {};
var amountOfFuncOfNormalTransaction = {};
let countOfExorbitantRPS = 0;
let countOfError = 0;

var preTime = 0; 
var amountOfCompleteTransactionOfPreTime = 0
var amountOfMvccrcOfPreTime = 0

function addPendingTransaction() {
    amountOfPendingTransaction += 1;
};

function minusPendingTransaction() {
    amountOfPendingTransaction -= 1;
};

function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};

async function addNormalQueue(transaction, needResned, ...args) {
    return new Promise((res, rej) => {
        normalQueue.push([transaction, needResned, res, args]);
    })
    
}

async function addOneByOneQueue (transaction, needResned, key,  ...args) {
    return new Promise((res, rej) => {
        if(key==undefined){
            key = `${transaction.contract.chaincodeId}_${transaction.name}`;
        }
        if (oneByOneQueue[key] == undefined){
            oneByOneQueue[key] = [];
        }
        oneByOneQueue[key].push([transaction, needResned, res, args]);
    })
}

function getNormalQueue() {
    let temp = normalQueue.shift();
    return [temp[0], temp[1], temp[2], temp[3]];
}



async function createTransactionAndGetData(contract, name){
    return await contract.createTransaction(name);
}

exports.normalController = async () => {;
    while(true){
        if(normalQueue.length == 0 || amountOfPendingTransaction >= upperOfPendingTransaction){
            break;
        }
        const [transaction, needResned, callback, args] = getNormalQueue();
        addPendingTransaction();
        const result = await submitTransaction(transaction, needResned, args);
        callback(result);
    }
}

exports.oneByOneController = async () => {
    for (var key in oneByOneQueue){
        if (oneByOneLock[key] != true) { 
            let transaction = oneByOneQueue[key][0][0];
            let needResned = oneByOneQueue[key][0][1];
            let callback = oneByOneQueue[key][0][2];
            let args = oneByOneQueue[key][0][3];
            oneByOneLock[key] = true;
            oneByOneQueue[key].splice(0, 1);
            if (!oneByOneQueue[key].length) {
                delete oneByOneQueue[key];
            }
            // console.log(oneByOneQueue);
            addPendingTransaction();
            const result = await submitTransaction(transaction, needResned, args);
            oneByOneLock[key] = false;
            callback(result);
        }
    }
}

async function transactionResend(transaction, needResned, args, countOfResned){
    countOfResned += 1;
    let time = 0
    // if(countOfResned <= 4){
    //     time = Math.pow(2, countOfResned);
    // } else {
    //     time = 16;
    // }
    console.log(`Trsanction ID ${transaction.getTransactionId()} MVCC_READ_CONFLICT "RESEND" WAIT ${time}`);
    await wait(Math.floor(Math.random() * time * 1000));
    let newTransaction = await createTransactionAndGetData(transaction.contract, transaction.name);
    // console.log(countOfResned);
    return await submitTransaction(newTransaction, needResned, args, countOfResned).then((res)=>{
        return [newTransaction.getTransactionId(), res, countOfResned];
    });
}

async function submitTransaction(transaction, needResned, args, countOfResned=0){
    let startTime = Date.now();
    try {
        return await transaction.submit(...args).then((res) => {
            minusPendingTransaction();
            amountOfCompleteTransaction += 1;
            logOfTransaction.log([transaction.getTransactionId(), res, countOfResned, startTime, Date.now()]);
            
            if(amountOfFuncOfNormalTransaction[transaction.getName()] == undefined){
                amountOfFuncOfNormalTransaction[transaction.getName()] = 1;
            }
            return [transaction.getTransactionId(), res, countOfResned];
        });
    } catch (errMg) {
        if (errMg[0]!=undefined){
            if (errMg[0].toString().includes("MVCC_READ_CONFLICT")) {
                if(ratioOfFuncOfMvccrc[transaction.getName()] == undefined){
                    ratioOfFuncOfMvccrc[transaction.getName()] = 1;
                }
                ratioOfFuncOfMvccrc[transaction.getName()] += 1;
                logOfTransaction.log([transaction.getTransactionId(), 'MVCCRC', countOfResned, startTime, Date.now()]);
                amountOfMvccrc += 1;
                if (needResned == true){
                    return await transactionResend(transaction, needResned, args, countOfResned);
                } else {
                    console.log(`Trsanction ID ${transaction.getTransactionId()} MVCC_READ_CONFLICT "NO RESEND"`);
                    minusPendingTransaction();
                    return [transaction.getTransactionId(), 'MVCCRC'];
                }  
            } else if (errMg[0].toString().includes("exceeding concurrency limit") || errMg[0].toString().includes("No valid responses from any peers") || errMg[0].toString().includes("No endorsement plan available")){
                countOfExorbitantRPS += 1;
                logOfTransaction.log([transaction.getTransactionId(), 'ERROR TOO MANY TRANSACTION', countOfResned, startTime, Date.now()]);
                console.log(`Trsanction ID ${transaction.getTransactionId()} ERROR TOO MANY TRANSACTION "RESEND"`);
                amountOfErrorOfTransaction += 1;
                return await transactionResend(transaction, needResned, args, countOfResned);
            } else {
                countOfError += 1;
                minusPendingTransaction();
            }  
        } else {
            minusPendingTransaction();
        }
        throw errMg;
    }         
}

exports.oneByOnePlusResend = async (contract, name, key, ...args) => {
    let transaction = await createTransactionAndGetData(contract, name);
    return await addOneByOneQueue(transaction, true, key, ...args);
}

exports.normalPlusResend = async (contract, name, ...args) => {
    let transaction = await createTransactionAndGetData(contract, name);
    return await addNormalQueue(transaction, true, ...args);
}

exports.oneByOne = async (contract, name, key, ...args) => {
    let transaction = await createTransactionAndGetData(contract, name);
    return await addOneByOneQueue(transaction, false, key, ...args);
}

exports.normal = async (contract, name, ...args) => {
    let transaction = await createTransactionAndGetData(contract, name);
    return await addNormalQueue(transaction, false, ...args);
}

// 
exports.evaluateTransactionPlusResend = async (contract, name, ...args) => {
    try{
        return await contract.evaluateTransaction(name, ...args);
    } catch (errMg) {
        if (errMg[0]!=undefined){
            if (errMg[0].toString().includes("property 'evaluateTransaction' of undefined")) {
                return await evaluateTransactionPlusResend (contract, name, ...args)
            }
        }
    }
}

exports.controllerParameterModify = async () => {
    let nowTime = Date.now();
    let amountOfCompleteTransactionOfNow = amountOfCompleteTransaction;
    let amountOfMvccrcOfNow = amountOfMvccrc;

    let tps = (amountOfCompleteTransactionOfNow - amountOfCompleteTransactionOfPreTime) / ((nowTime - preTime) / 1000);
    let tpsOfMvccrc = (amountOfMvccrcOfNow - amountOfMvccrcOfPreTime) / ((nowTime - preTime) / 1000);

    let result = {
        "preTime": preTime, 
        "nowTime": nowTime,
        "amountOfPendingTransaction": amountOfPendingTransaction,
        "tps": tps,
        "tpsOfMvccrc": tpsOfMvccrc,
        "ratioOfMvccrc": tpsOfMvccrc / (tps + tpsOfMvccrc),
        "lengthOfNormalQueue": normalQueue.length,
        "amountOfTypeOfOneByOneQueue": Object.keys(oneByOneQueue).length,
        "amountOfCompleteTransaction": amountOfCompleteTransactionOfNow,
        "amountOfMvccrcOfNow": amountOfMvccrcOfNow,
        "countOfExorbitantRPS": countOfExorbitantRPS,
        "countOfError": countOfError
    }
    
    console.log(result);
    logOfResult.log(result);

    if(amountOfErrorOfTransaction >= 1 && nowTime - lastTimeOfMinusUpperOfPendingTransaction >= timeIntervalOfMinusUpperOfPendingTransaction){
        lastTimeOfMinusUpperOfPendingTransaction = nowTime;
        upperOfPendingTransaction = upperOfPendingTransaction / 2;
        amountOfErrorOfTransaction = 0;
    } else {
        if (amountOfPendingTransaction >= (upperOfPendingTransaction *0.8)){
            upperOfPendingTransaction = upperOfPendingTransaction + tps;
        }
    }

    preTime = nowTime;
    amountOfCompleteTransactionOfPreTime = amountOfCompleteTransactionOfNow;
    amountOfMvccrcOfPreTime = amountOfMvccrcOfNow;

    return result;
}

