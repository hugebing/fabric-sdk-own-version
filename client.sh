!/bin/bash

export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_createAccount_amountOfAccount=$amountOfAccount"
cd data
mkdir $folderName
cd ..
export amountOfAccount=10000
node smallbank_createAccount.js 


不同 Block size 的影響
for i in 10 50 100 150 200
do
    export skew=1
    export probOfFunc=50
    export type=0
    export BatchSize=$i
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='all'
    export functionType='all'
    export readType='normal'
    export writeType='normal'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done

不同 Block size 的影響
for i in 10 50 100 150 200
do
    export skew=1
    export probOfFunc=50
    export type=0
    export BatchSize=$i
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='all'
    export functionType='all'
    export readType='txQueue'
    export writeType='txQueue'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done

不同 skew 在 readHeavily 的影響
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=5
    export type=0
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='all'
    export functionType='all'
    export readType='normal'
    export writeType='normal'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done


不同 skew 在 balanced 的影響
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=50
    export type=0
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='all'
    export functionType='all'
    export readType='normal'
    export writeType='normal'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done

不同 skew 在 writeHeavily 的影響
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=95
    export type=0
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='all'
    export functionType='all'
    export readType='normal'
    export writeType='normal'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done

不同 skew 在 readHeavily 的影響
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=5
    export type=0
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='all'
    export functionType='all'
    export readType='txQueue'
    export writeType='txQueue'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done


不同 skew 在 balanced 的影響
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=50
    export type=0
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='all'
    export functionType='all'
    export readType='txQueue'
    export writeType='txQueue'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done

不同 skew 在 writeHeavily 的影響
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=95
    export type=0
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='all'
    export functionType='all'
    export readType='txQueue'
    export writeType='txQueue'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done

不同 skew 在 readHeavily 的影響 hotAccount 是 sender
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=5
    export type=1
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='sender'
    export functionType='1'
    export readType='normal'
    export writeType='normal'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done


不同 skew 在 balanced 的影響 hotAccount 是 sender
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=50
    export type=1
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='sender'
    export functionType='1'
    export readType='normal'
    export writeType='normal'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done

不同 skew 在 writeHeavily 的影響 hotAccount 是 sender
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=95
    export type=1
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='sender'
    export functionType='1'
    export readType='normal'
    export writeType='normal'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done

不同 skew 在 readHeavily 的影響 hotAccount 是 recipient
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=5
    export type=1
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='recipient'
    export functionType='1'
    export readType='normal'
    export writeType='normal'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done


不同 skew 在 balanced 的影響 hotAccount 是 recipient
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=50
    export type=1
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='recipient'
    export functionType='1'
    export readType='normal'
    export writeType='normal'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done

不同 skew 在 writeHeavily 的影響 hotAccount 是 recipient
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=95
    export type=1
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='recipient'
    export functionType='1'
    export readType='normal'
    export writeType='normal'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done


不同 skew 在 readHeavily 的影響 hotAccount 是 sender 有 txqueue
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=5
    export type=1
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='sender'
    export functionType='1'
    export readType='normal'
    export writeType='txQueue'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done


不同 skew 在 balanced 的影響 hotAccount 是 sender 有 txqueue
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=50
    export type=1
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='sender'
    export functionType='1'
    export readType='normal'
    export writeType='txQueue'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done

不同 skew 在 writeHeavily 的影響 hotAccount 是 sender 有 txqueue
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=95
    export type=1
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='sender'
    export functionType='1'
    export readType='normal'
    export writeType='txQueue'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done

#平只驗

不同 skew 在 readHeavily 的影響 hotAccount 是 recipient 有 txqueue
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=5
    export type=1
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='recipient'
    export functionType='1'
    export readType='normal'
    export writeType='txQueue'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done


不同 skew 在 balanced 的影響 hotAccount 是 recipient 有 txqueue
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=50
    export type=1
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='recipient'
    export functionType='1'
    export readType='normal'
    export writeType='txQueue'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done

不同 skew 在 writeHeavily 的影響 hotAccount 是 recipient 有 txqueue
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=95
    export type=1
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='recipient'
    export functionType='1'
    export readType='normal'
    export writeType='txQueue'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done

不同 skew 在 readHeavily 的影響 hotAccount 是 sender 有 txqueue 加上延遲重送
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=5
    export type=2
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='sender'
    export functionType='1'
    export readType='normal'
    export writeType='txQueue'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done


不同 skew 在 balanced 的影響 hotAccount 是 sender 有 txqueue 加上延遲重送
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=50
    export type=2
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='sender'
    export functionType='1'
    export readType='normal'
    export writeType='txQueue'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done

不同 skew 在 writeHeavily 的影響 hotAccount 是 sender 有 txqueue 加上延遲重送
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=95
    export type=2
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='sender'
    export functionType='1'
    export readType='normal'
    export writeType='txQueue'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done

不同 skew 在 readHeavily 的影響 hotAccount 是 recipient 有 txqueue 加上延遲重送
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=5
    export type=2
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='recipient'
    export functionType='1'
    export readType='normal'
    export writeType='txQueue'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done


不同 skew 在 balanced 的影響 hotAccount 是 recipient 有 txqueue 加上延遲重送
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=50
    export type=2
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='recipient'
    export functionType='1'
    export readType='normal'
    export writeType='txQueue'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done

不同 skew 在 writeHeavily 的影響 hotAccount 是 recipient 有 txqueue 加上延遲重送
for i in $(seq 0.0 0.2 2.0)
do
    export skew=$i
    export probOfFunc=95
    export type=2
    export BatchSize=100
    export amountOfAccount=10000
    export startTime=$((`date '+%s'`*1000+8000))
    export hotAccount='recipient'
    export functionType='1'
    export readType='normal'
    export writeType='txQueue'
    export rps=200
    export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"
    
    cd ../fabric-samples/test-network/
    bash updateBatchSize.sh $BatchSize
    cd ../../fabric-client
    cd data
    mkdir $folderName
    cd ..
    # node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
    node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
    # echo $startTime
done




274

export skew=2
export probOfFunc=50
export type=0
export BatchSize=100
export amountOfAccount=10000
export startTime=$((`date '+%s'`*1000+8000))
export hotAccount='recipient'
export functionType='1'
export readType='normal'
export writeType='txQueue'
export rps=200
export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"

cd ../fabric-samples/test-network/
bash updateBatchSize.sh $BatchSize
cd ../../fabric-client
cd data
mkdir $folderName
cd ..
# node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
# echo $startTime


export skew=1.2
export probOfFunc=95
export type=1
export BatchSize=100
export amountOfAccount=10000
export startTime=$((`date '+%s'`*1000+8000))
export hotAccount='sender'
export functionType='1'
export readType='normal'
export writeType='txQueue'
export rps=200
export folderName="$(date +"%Y-%m-%d-%H:%M:%S")_smallbank_skew=$skew-probOfFunc=$probOfFunc-BatchSize=$BatchSize-amountOfAccount=$amountOfAccount-hotAccount=$hotAccount-functionType=$functionType-readType=$readType-writeType=$writeType-type=$type-rps=$rps"

cd ../fabric-samples/test-network/
bash updateBatchSize.sh $BatchSize
cd ../../fabric-client
cd data
mkdir $folderName
cd ..
# node smallbank.js 1 & node smallbank.js 2 & node smallbank.js 3 & node smallbank.js 4 & node smallbank.js 5
node smallbank_txQueue.js 1 & node smallbank_txQueue.js 2 & node smallbank_txQueue.js 3 & node smallbank_txQueue.js 4 & node smallbank_txQueue.js 5
# echo $startTime

// 證明 rps 越快 tps 越低




















