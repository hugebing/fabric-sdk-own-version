/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

require('dotenv').config();

// 須帶入的參數
const countOfClient = process.argv.splice(2);
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
const chaincodeName = 'erc-20';
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

async function getClientID(contract) {
    try {
        const clientID = await contract.evaluateTransaction('ClientAccountID');
        return clientID;
        // return await evaluateTransactionPlusResend(contract, 'ClientAccountID');
    } catch (error) {
        console.log(error);
        console.error(`******** FAILED to get client ID: ${error}`);
        return error;
    }
}

async function mint(contract, amount) {
    try {
        return await normalPlusResend(contract, 'Mint', amount);
    } catch (error) {
        console.error(`******** FAILED to mint1: ${error}`);
        return error;
    }
}

async function query(res, contract) {
    try {
        console.log(`\n--> [${GRPC}] Evaluate Transaction: Get balance of user`);
        const balance = await getBalance(contract);
        const balanceString = prettyJSONString(balance);
        console.log(`Balance of users: ${balanceString}}\n`);
    } catch (error) {
        console.error(`******** FAILED: ${error}`);
    }

}

async function getBalance(contract) {
    try {
        const balance = await contract.evaluateTransaction('ClientAccountBalance');
        return balance;
    } catch (error) {
        console.error(`******** FAILED to get balance: ${error}`);
        return error;
    }
}

async function transfer(fromContract, toContract, value) {
    try {
        let toId = await getClientID(toContract);
        // return await contract.evaluateTransaction('ClientAccountID');
        // return await normalPlusResend(fromContract, 'Transfer', toId, value);
        return await oneByOnePlusResend(fromContract, 'Transfer', toId, value);
    } catch (error) {
        console.log(error);
        console.error(`******** FAILED to transfer: ${error}`);
        return error;
    }
}

async function disconnect(gateway){
    try {
        gateway.disconnect();
        return null;
    } catch (error) {
        console.error(`******** FAILED to disconnect fabric network: ${error}`);
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

let hotKeyCount = 0;

function getAccountId(probOfHot) {
    let accountId = 0;
    if(Math.random() <= probOfHot) {
        // accountId = getRandom(0, amountOfHotAccount);
        accountId = Math.floor((hotKeyCount/(rps/3))%(rps/3));
        hotKeyCount += 1;
    } else {
        accountId = getRandom(amountOfHotAccount, amountOfAccount);
    }
    return accountId;
}




// async function fixLoad() {
//     let preTime = Date.now()

//     while (true){
//         if(Date.now() - preTime >= totalDuration){
//             break;
//         }
//         if (txLoadNum < txLoadUpper){
//             if(chaincodeFunc=='transfer'){
//                 let from;
//                 let to;
//                 let toClientId;
//                 console.log('transferrrrrrrrrrrrrrrrrrrrrrrrrrrr');
//                 let value = 10;
//                 if(resendWiatTx.length != 0) {
//                     // 從重送交易的陣列拿到重送資料
//                     let temp = resendWiatTx.shift();
//                     // console.log(`temp ${temp}`);
//                     from = contracts.get(temp[0]);
//                     toClientId = temp[1];
//                     value = temp[2];
//                     console.log(`交易重送送送送送送送送送送送送 ${from} ${toClientId} ${value}`)
    
//                 } else {
//                     let senderId = getAccountId(probOfSendHotAccount);
//                     let recipientId = getAccountId(probOfReceiptHotAccount);
                    
//                     // 這裡有修改
//                     from = contracts.get(rps);
//                     to = contracts.get(delayUpper);
//                     // console.log(recipientId);
//                     toClientId = undefined;
//                 }
    
//                 txLoadNum += 1;
//                 txAmount += 1;
//                 transfer(from, to, toClientId, `${value}`);
//             }

//             if(chaincodeFunc=='getBalance'){
//                 txLoadNum += 1;
//                 txAmount += 1;
//                 console.log('getBalanceeeeeeeeeeeeeeeeeeeeee');
//                 getBalance(contracts.get(199));
//             }
//         } else {
//             await wait(4);
//         }    
//     }
 
// }

async function fixRate() {

    let preTime = Date.now()

    while (true){
        if(Date.now() - preTime >= totalDuration){
            break;
        }
        let from;
        let to;
        let toClientId;

        let count = 1;
        let recipientId = 1;
        for(let i = 0;i < rps;i++){  

            let value = 10;
            
            // let senderId = getAccountId(probOfSendHotAccount);
            // let recipientId = getAccountId(probOfReceiptHotAccount);
            // let senderId = getRandom(1, 199);
            let senderId = parseInt(countOfClient);
            // if(count%10==0){
            //     recipientId = getRandom(1, 199);
            // };
            let  recipientId = getRandom(3, 199);
            // let recipientId = 0;
            // console.log(`senderId ${senderId} recipientId ${recipientId}`);
            from = contracts.get(senderId);
            to = contracts.get(recipientId);
            txAmount += 1;
            transfer(from, to, `${value}`);
            count ++;
        }
        
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

    let startTime = Date.now() + (30000 - (Date.now() % 30000)) + 30000;
    // let startTime = Date.now();
    setInterval(function(){ controllerParameterModify() }, 1000);
    setInterval(function(){ normalController() }, 100);
    setInterval(function(){ oneByOneController() }, 100);

    let users = [];
    
    // Generate users


    fs.readdirSync('./transferWallet').forEach(file => {
        if(file.includes('appUser')){
            users.push(file.slice(0, -3)) 
        }
    });
    ccp = await buildCCPOrg1(GRPC.toString());
    wallet = await buildWallet(Wallets, walletPath);
    // console.log(users);
    // console.log(`users0  ${users[0]}`);
    // console.log(`users99  ${users[99]}`);
    // Generate users

    for (let i = 0; i < users.length; i++){
        const contract = await getCC(ccp, wallet, users[i]);
        contracts.set(i, contract);
        contracts.set(users[i], contract);
    }

    // let preTime = Date.now();


    if(benchmarkType=='fixRate'){
        await wait(startTime - Date.now());
        console.log(`開始時間時間時間時間時間時間 ${Date.now()}`);
        await fixRate();
        await controllerParameterModify();
        console.log(`結束時間時間時間時間時間時間 ${Date.now()}`);
        process.exit();
    }

    // if(benchmarkType=='fixLoad'){
    //     await fixLoad();
    // }

}

main();