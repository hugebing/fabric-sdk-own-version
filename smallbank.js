/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

require('dotenv').config();

const zipfian = require('zipfian-integer')
const sample = zipfian(0, 199, 1)


// for(let i=0;i<200;i++){
//     console.log(sample())
// }

// 須帶入的參數
const folderName = process.env.folderName;
// const mintBool = (process.env.mintBool === 'true');
// const amountOfAccount = parseInt(process.env.amountOfAccount);
// const amountOfHotAccount = parseInt(process.env.amountOfHotAccount);
// const probOfSendHotAccount = parseFloat(process.env.probOfSendHotAccount);
// const probOfReceiptHotAccount = parseFloat(process.env.probOfReceiptHotAccount);
// const resendLatencyBool = (process.env.resendLatencyBool === 'true');
// const benchmarkType = process.env.benchmarkType;
// const rps = parseInt(process.env.rps);
// const delayUpper = parseInt(process.env.delayUpper);
// const totalDuration = parseInt(process.env.totalDuration);
// const chaincodeFunc = process.env.chaincodeFunc;
// const txLoadUpper = parseInt(process.env.txLoadUpper);
// const needResendBool = (process.env.needResendBool === 'true');

// let txLoadNum = 0;
// let txAmount = 0;
// let txcomplete = 0;

// console.log(mintBool);
// console.log(amountOfAccount);
// console.log(amountOfHotAccount);
// console.log(probOfSendHotAccount);
// console.log(probOfReceiptHotAccount);
// console.log(resendLatencyBool);
// console.log(benchmarkType);
// console.log(rps);
// console.log(delayUpper);
// console.log(totalDuration);


const mintBool = false;
const amountOfAccount = 200;
const amountOfHotAccount = 10;
const probOfSendHotAccount = 0;
const probOfReceiptHotAccount = 0;
// const resendLatencyBool = false;
const benchmarkType = 'fixRate';
const rps = 200;
// const delayUpper = 10000;
const totalDuration = 60000;
// const totalDuration = 0;
// const chaincodeFunc = 0;
// const txLoadUpper = 0;
// const needResendBool = 1;
let contract;






let txLoadNum = 0;
let txAmount = 0;
let txcomplete = 0;
let resendWiatTx = [];
let contracts = new Map();
let txData = [];
let gateways = [];
let getBalanceComplete = 0;
let transferComplete = 0;







// GRPC 要改
const GRPC = 0;
let success = 0;
let fail1 = 0; // number of get ClientID error
let fail2 = 0; // number of MVCC_READ_CONFLICT or other reasons
let fail3 = 0; // number of mint error
let mvccFail = 0;

let count = 0; // count = success + fail1 + fail2

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const { controllerParameterModify, oneByOnePlusResend, normalPlusResend, evaluateTransactionPlusResend, oneByOneController, normalController, oneByOne, normal, controller } = require('./transactioncontroller');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('./test-application/javascript/AppUtil.js');
const { BlockDecoder } = require('fabric-common');
const { fabproto6 } = require('fabric-protos');

const caHost = `ca.org1.example.com`;
const department = `org1.department1`;
const mspOrg = `Org1MSP`;
const channelName = 'mychannel';
const chaincodeName = 'smallbank';
const walletPath = path.join(__dirname, 'transferWallet');
const orgUserId = `appUser`;
const testFolder = './tests/';
const fs = require('fs');
var protobuf = require("protobufjs/light");

let ccp;
let wallet;
let qsccContract;

console.log(`Starting Fabric Server ${GRPC}...\ncaHost:${caHost}\ndepartment:${department}\nmspOrg:${mspOrg}\n`)

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};

function deleteFiles(folderPath) {
    let forlder_exists = fs.existsSync(folderPath);
    if (forlder_exists) {
        let fileList = fs.readdirSync(folderPath);
        fileList.forEach(function (fileName) {
        fs.unlinkSync(path.join(folderPath, fileName));
        });
    }
}



// 檢查事項：
// 清除錢包內的東西
// 要不要合約初始化

// pre-requisites:
// - fabric-sample two organization test-network setup with two peers, ordering service,
//   and 2 certificate authorities
//         ===> from directory /fabric-samples/test-network
//         ./network.sh up createChannel -ca
// - Use any of the asset-transfer-basic chaincodes deployed on the channel "mychannel"
//   with the chaincode name of "basic". The following deploy command will package,
//   install, approve, and commit the javascript chaincode, all the actions it takes
//   to deploy a chaincode to a channel.
//         ===> from directory /fabric-samples/test-network
//         ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript
// - Be sure that node.js is installed
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node -v
// - npm installed code dependencies
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         npm install
// - to run this test application
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node app.js

// NOTE: If you see  kind an error like these:
/*
    2020-08-07T20:23:17.590Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
    ******** FAILED to run the application: Error: DiscoveryService: mychannel error: access denied
   OR
   Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 20, message: 'Authentication failure' } ]]
   ******** FAILED to run the application: Error: Identity not found in wallet: appUser
*/
// Delete the /fabric-samples/asset-transfer-basic/application-javascript/wallet directory
// and retry this application.
//
// The certificate authority must have been restarted and the saved certificates for the
// admin and application user are not valid. Deleting the wallet store will force these to be reset
// with the new certificate authority.
//

/**
 *  A test application to show basic queries operations with any of the asset-transfer-basic chaincodes
 *   -- How to submit a transaction
 *   -- How to query and check the results
 *
 * To see the SDK workings, try setting the logging to show on the console before running
 *        export HFC_LOGGING='{"debug":"console"}'
 */
async function enrollUsers(amountOfAccount) {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		ccp = await buildCCPOrg1(GRPC.toString());

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, caHost);

		// setup the wallet to hold the credentials of the application user
		wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg);

        let users = [];
        for (let i = 0; i < amountOfAccount; i++) {
            let user = `${orgUserId}-${Math.random()}`;
            // in a real application this would be done only when a new user was required to be added
		    // and would be part of an administrative flow
            await registerAndEnrollUser(caClient, wallet, mspOrg, user, department);
            users.push(user);
        }

        return ccp, wallet, users

    } catch (error) {
		console.error(`******** FAILED to enroll users: ${error}`);
        return error;
	}
}

async function getCC(ccp, wallet, user) {
    try {
        // Create a new gateway instance for interacting with the fabric network.
        // In a real application this would be done as the backend server session is setup for
        // a user that has been verified.
        const gateway = new Gateway();

        // setup the gateway instance
        // The user will now be able to create connections to the fabric network and be able to
        // submit transactions and query. All transactions submitted by this gateway will be
        // signed by this user using the credentials stored in the wallet.
        await gateway.connect(ccp, {
            wallet,
            identity: user,
            discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
        });


        gateways.push(gateway);
        // Build a network instance based on the channel where the smart contract is deployed
        const network = await gateway.getNetwork(channelName);

        // let org1Endorser = network.getChannel().getEndorser("peer0.org1.example.com:7051");
        // let org2Endorser = network.getChannel().getEndorser("peer0.org2.example.com:9051");

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);
        qsccContract = network.getContract("qscc");
        return contract;

    } catch (error) {
        console.error(`******** FAILED to connect fabric network: ${error}`);
        return error;
    }
}



async function createAccount(contract, id, name, checkingBalance, savingsBalance) {
    try {
        var args = [id, name, checkingBalance, savingsBalance].map(d => `"${d}"`).join(',');
        // console.log(`"[${args}]"`);
        return await normal(contract, 'CreateAccount', [`[${args}]`]);
    } catch (error) {
        console.error(`******** FAILED to createAccount: ${error}`);
        return error;
    }
}

async function query(contract, id) {
    try {
        var args = [id].map(d => `"${d}"`).join(',');
        return await normal(contract, 'Query', [`[${args}]`]);
    } catch (error) {
        console.error(`******** FAILED to query: ${error}`);
    }

}

async function sendPayment(contract, checkingValue, toId, fromId) {
    try {
        var args = [checkingValue, toId, fromId].map(d => `"${d}"`).join(',');
        return await normal(contract, 'SendPayment', [`[${args}]`]);
    } catch (error) {
        console.error(`******** FAILED to sendPayment: ${error}`);
        return error;
    }
}

async function writeCheck(contract, checkingValue, id) {
    try {
        var args = [checkingValue, id].map(d => `"${d}"`).join(',');
        return await normal(contract, 'WriteCheck', [`[${args}]`]);
    } catch (error) {
        console.error(`******** FAILED to writeCheck: ${error}`);
        return error;
    }
}

async function transactSavings(contract, savingValue, id) {
    try {
        var args = [savingValue, id].map(d => `"${d}"`).join(',');
        return await normal(contract, 'TransactSavings', [`[${args}]`]);
    } catch (error) {
        console.error(`******** FAILED to transactSavings: ${error}`);
        return error;
    }
}

async function depositChecking(contract, checkingValue, id) {
    try {
        var args = [checkingValue, id].map(d => `"${d}"`).join(',');
        return await normal(contract, 'DepositChecking', [`[${args}]`]);
    } catch (error) {
        console.error(`******** FAILED to depositChecking: ${error}`);
        return error;
    }
}

async function amalgamate(contract, toId, fromId) {
    try {
        var args = [toId, fromId].map(d => `"${d}"`).join(',');
        return await normal(contract, 'amalgamate', [`[${args}]`]);
    } catch (error) {
        console.error(`******** FAILED to amalgamate: ${error}`);
        return error;
    }
}


// transaction.js
// 1. result
// 2. chaincode name
// 3. 參數
// 4. tx id

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

let functionOfSuccessCount = [0, 0, 0, 0, 0, 0]
let functionOfMvccrcCount = [0, 0, 0, 0, 0, 0]
async function fixRate() {

    let preTime = Date.now()
    let count = 0;
    while (true){
        if(Date.now() - preTime >= totalDuration){
            break;
        }


        
        for(let i = 0;i < rps;i++){ 
            if(getRandom(1, 101)>5){
                query(contract, sample()).then((res)=>{
                    if(res[1]=="MVCCRC"){
                        functionOfMvccrcCount[0]++;
                    } else {
                        functionOfSuccessCount[0]++;
                    }
                })
            } else {
                let functionNum = getRandom(1, 6);
                let checkingValue = 1;
                let savingValue = 1;
                let fromId = sample();
                let toId = sample();
                let id = sample();
                if(functionNum==1){
                    sendPayment(contract, checkingValue, toId, fromId).then((res)=>{  
                        if(res[1]=="MVCCRC"){
                            functionOfMvccrcCount[1]++;
                        } else {
                            functionOfSuccessCount[1]++;
                        }
                        
                    })
                    console.log(`sendPayment`);
                } else if (functionNum==2){
                    writeCheck(contract, checkingValue, id).then((res)=>{
                        if(res[1]=="MVCCRC"){
                            functionOfMvccrcCount[2]++;
                        } else {
                            functionOfSuccessCount[2]++;
                        }
                    })
                    console.log(`writeCheck`);
                } else if (functionNum==3){
                    transactSavings(contract, savingValue, id).then((res)=>{
                        if(res[1]=="MVCCRC"){
                            functionOfMvccrcCount[3]++;
                        } else {
                            functionOfSuccessCount[3]++;
                        }
                    })
                    console.log(`transactSavings`);
                } else if (functionNum==4){
                    depositChecking(contract, checkingValue, id).then((res)=>{
                        if(res[1]=="MVCCRC"){
                            functionOfMvccrcCount[4]++;
                        } else {
                            functionOfSuccessCount[4]++;
                        }
                    })
                    console.log(`depositChecking`);
                } else if (functionNum==5){
                    amalgamate(contract, toId, fromId).then((res)=>{
                        if(res[1]=="MVCCRC"){
                            functionOfMvccrcCount[5]++;
                        } else {
                            functionOfSuccessCount[5]++;
                        }
                    })
                    console.log(`amalgamate`);
                }
            }

            count ++;
        }
        console.log(count);
        await wait(1000 - ((Date.now()- preTime) % 1000));
    }
}

// async function getRawData(){
//     for(let i=0;i<txData.length;i++){
//         if (i%300==0){
//             await wait(1000);
//         }
//         let blockData = await qsccContract.evaluateTransaction('GetBlockByTxID', channelName, txData[i][0]);
//         const blockDataJson = BlockDecoder.decode(blockData);
//         txData[i].push(blockDataJson['header']['number']['low']);
//     }
// }




async function main(){

    let startTime = Date.now() + (1000 - (Date.now() % 1000)) + 1000;

    setInterval(function(){ controllerParameterModify() }, 1000);
    setInterval(function(){ normalController() }, 100);
    setInterval(function(){ oneByOneController() }, 100);

    let users = [];
    fs.readdirSync('./transferWallet').forEach(file => {
        if(file.includes('appUser')){
            users.push(file.slice(0, -3)) 
        }
    });
    ccp = await buildCCPOrg1(GRPC.toString());
    wallet = await buildWallet(Wallets, walletPath);
    contract = await getCC(ccp, wallet, users[0]);


    const readFile = require("util").promisify(fs.readFile);

    async function runRead(filePath) {
        try {
            const fr = await readFile(filePath,"utf-8");
            return fr;
        } catch (err) {
            console.log('Error', err);
        }    
    }

    if(benchmarkType=='fixRate'){
        await wait(startTime - Date.now());
        console.log(`開始時間時間時間時間時間時間 ${Date.now()}`);
        await fixRate();
        await controllerParameterModify().then(async (res)=>{
            let result = {
                "folderName": folderName,
                "amountOfCompleteTransaction": res.amountOfCompleteTransaction,
                "amountOfMvccrc": res.amountOfMvccrcOfNow,
                "queryOfSucces": functionOfSuccessCount[0],
                "sendPaymentOfSucces": functionOfSuccessCount[1],
                "writeCheckOfSucces": functionOfSuccessCount[2],
                "transactSavingsOfSucces": functionOfSuccessCount[3],
                "depositCheckingOfSucces": functionOfSuccessCount[4],
                "amalgamateOfSucces": functionOfSuccessCount[5],
                "queryOfMvccrc": functionOfMvccrcCount[0],
                "sendPaymentOfMvccrc": functionOfMvccrcCount[1],
                "writeCheckOfMvccrc": functionOfMvccrcCount[2],
                "transactSavingsOfMvccrc": functionOfMvccrcCount[3],
                "depositCheckingOfMvccrc": functionOfMvccrcCount[4],
                "amalgamateOfMvccrc": functionOfMvccrcCount[5],
                "tps": res.amountOfCompleteTransaction/(totalDuration/1000)
            }
            // fs.writeFileSync(`data/${folderName}/data.txt`, JSON.stringify(result));
            if(fs.existsSync(`data/${folderName}/total.txt`)==true){
                await runRead(`data/${folderName}/total.txt`).then((res)=>{
                    res = JSON.parse(res);
                    result.amountOfCompleteTransaction += res.amountOfCompleteTransaction;
                    result.amountOfMvccrc += res.amountOfMvccrc;
                    result.queryOfSucces += res.queryOfSucces;
                    result.sendPaymentOfSucces += res.sendPaymentOfSucces;
                    result.writeCheckOfSucces += res.writeCheckOfSucces;
                    result.transactSavingsOfSucces += res.transactSavingsOfSucces;
                    result.depositCheckingOfSucces += res.depositCheckingOfSucces;
                    result.amalgamateOfSucces += res.amalgamateOfSucces;
                    result.queryOfMvccrc += res.queryOfMvccrc;
                    result.sendPaymentOfMvccrc += res.sendPaymentOfMvccrc;
                    result.writeCheckOfMvccrc += res.writeCheckOfMvccrc;
                    result.transactSavingsOfMvccrc += res.transactSavingsOfMvccrc;
                    result.depositCheckingOfMvccrc += res.depositCheckingOfMvccrc;
                    result.amalgamateOfMvccrc += res.amalgamateOfMvccrc;
                    result.tps = result.amountOfCompleteTransaction/(totalDuration/1000)
                })
                fs.writeFileSync(`data/${folderName}/total.txt`, JSON.stringify(result));
            } else {
                fs.writeFileSync(`data/${folderName}/total.txt`, JSON.stringify(result));
            }
        })
        console.log(`結束時間時間時間時間時間時間 ${Date.now()}`);
        process.exit();
    }

}

main();