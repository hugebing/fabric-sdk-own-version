const { Transaction } = require("fabric-network");
const { Console } = require("console");
const fs = require("fs");

let timeOfFile = Date.now();
// make a new logger

const logOfTransaction = new Console({
    stdout: fs.createWriteStream(`${timeOfFile}_logOfTransaction`),
});
const logOfResult = new Console({
    stdout: fs.createWriteStream(`${timeOfFile}_logOfResult`),
});

var oneByOneQueue = [];
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
var waitingTimeOfResend = {};

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

async function addOneByOneQueue (transaction, needResned,  ...args) {
    return new Promise((res, rej) => {
        oneByOneQueue.push([transaction, needResned, res, args]);
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
    for(let i=0;i<oneByOneQueue.length;i++){
        let chaincodeIdPlusNameFuncOfMvccrc = `${oneByOneQueue[i][0].contract.chaincodeId}_${oneByOneQueue[i][0].name}`;
        if (oneByOneLock[`${chaincodeIdPlusNameFuncOfMvccrc}`] != true) { 
            let transaction = oneByOneQueue[i][0];
            let needResned = oneByOneQueue[i][1];
            let callback = oneByOneQueue[i][2];
            let args = oneByOneQueue[i][3];
            oneByOneLock[`${transaction.contract.chaincodeId}_${transaction.name}`] = true;
            oneByOneQueue.splice(i, 1); 
            addPendingTransaction();
            const result = await submitTransaction(transaction, needResned, args);
            oneByOneLock[`${transaction.contract.chaincodeId}_${transaction.name}`] = false;
            callback(result);
        }
    }
}

async function transactionResend(transaction, needResned, args, countOfResned){
    // let resendTime = waitTime(transaction.getName()) * 1000;
    let resendTime = 0;
    console.log(`Trsanction ID ${transaction.getTransactionId()} MVCC_READ_CONFLICT "RESEND" WAIT ${resendTime}`);
    await wait(resendTime);
    let newTransaction = await createTransactionAndGetData(transaction.contract, transaction.name);
    countOfResned += 1;
    await submitTransaction(newTransaction, needResned, args, countOfResned).then((res)=>{
        return res;
    });
}

let countOfExorbitantRPS = 0;
let countOfError = 0;

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

// oneByOneQueue
exports.oneByOnePlusResend = async (contract, name, ...args) => {
    let transaction = await createTransactionAndGetData(contract, name);
    return await addOneByOneQueue(transaction, true, ...args);
}

// PlusResend 沒加上計數
exports.normalPlusResend = async (contract, name, ...args) => {
    let transaction = await createTransactionAndGetData(contract, name);
    return await addNormalQueue(transaction, true, ...args);
}

// oneByOneQueue
exports.oneByOne = async (contract, name, ...args) => {
    let transaction = await createTransactionAndGetData(contract, name);
    return await addOneByOneQueue(transaction, false, ...args);
}

// normal 沒加上計數
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
        "lengthOfOneByOneQueue": oneByOneQueue.length,
        "amountOfCompleteTransaction": amountOfCompleteTransactionOfNow,
        "amountOfMvccrcOfNow": amountOfMvccrcOfNow,
        "countOfExorbitantRPS": countOfExorbitantRPS,
        "countOfError": countOfError
    }
    
    console.log(result);
    logOfResult.log(result);

    // 要不要增加上限?
    let amountOfFuncOfMvccrc = Object.keys(ratioOfFuncOfMvccrc);

    // 取重送延遲 Function 與有發生 MVCCRC Function 的差集
    let diffOfArray = Object.keys(waitingTimeOfResend).filter((e)=>{return amountOfFuncOfMvccrc.indexOf(e) === -1})

    for(let i=0;i<diffOfArray.length;i++){
        waitingTimeOfResend[diffOfArray[i]] = waitingTimeOfResend[diffOfArray[i]] - 1;
        if(waitingTimeOfResend[diffOfArray[i]]==0){
            delete waitingTimeOfResend[diffOfArray[i]];
        }
    }

    for(let i=0;i<amountOfFuncOfMvccrc.length;i++){
        if(waitingTimeOfResend[amountOfFuncOfMvccrc[i]]==undefined){
            waitingTimeOfResend[amountOfFuncOfMvccrc[i]] = 0;
        }

        if(amountOfFuncOfNormalTransaction[amountOfFuncOfMvccrc[i]]==undefined  && waitingTimeOfResend[amountOfFuncOfMvccrc[i]] <= 15){
            waitingTimeOfResend[amountOfFuncOfMvccrc[i]] += 1;
        } else if((ratioOfFuncOfMvccrc[amountOfFuncOfMvccrc[i]]/(ratioOfFuncOfMvccrc[amountOfFuncOfMvccrc[i]]+amountOfFuncOfNormalTransaction[amountOfFuncOfMvccrc[i]])) > 0.5 && waitingTimeOfResend[amountOfFuncOfMvccrc[i]] <= 15){
            waitingTimeOfResend[amountOfFuncOfMvccrc[i]] += 1;
        } else if((ratioOfFuncOfMvccrc[amountOfFuncOfMvccrc[i]]/(ratioOfFuncOfMvccrc[amountOfFuncOfMvccrc[i]]+amountOfFuncOfNormalTransaction[amountOfFuncOfMvccrc[i]])) < 0.1) {
            waitingTimeOfResend[amountOfFuncOfMvccrc[i]] = waitingTimeOfResend[amountOfFuncOfMvccrc[i]] -= 1;
        }

        if(waitingTimeOfResend[amountOfFuncOfMvccrc[i]]==0){
            delete waitingTimeOfResend[amountOfFuncOfMvccrc[i]];
        }
    }

    amountOfFuncOfNormalTransaction = {};
    ratioOfFuncOfMvccrc = {};

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
}

