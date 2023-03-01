docker exec peer0.org1.example.com apk add iproute2
docker exec -it peer0.org1.example.com tc qdisc add dev eth0 root netem delay 0ms
docker exec -it peer0.org1.example.com tc qdisc change dev eth0 root netem delay 10ms loss 1%

docker exec peer1.org1.example.com apk add iproute2
docker exec -it peer1.org1.example.com tc qdisc add dev eth0 root netem delay 0ms
docker exec -it peer1.org1.example.com tc qdisc change dev eth0 root netem delay 10ms loss 1%

docker exec peer2.org1.example.com apk add iproute2
docker exec -it peer2.org1.example.com tc qdisc add dev eth0 root netem delay 0ms
docker exec -it peer2.org1.example.com tc qdisc change dev eth0 root netem delay 10ms loss 1%

docker exec peer3.org1.example.com apk add iproute2
docker exec -it peer3.org1.example.com tc qdisc add dev eth0 root netem delay 0ms
docker exec -it peer3.org1.example.com tc qdisc change dev eth0 root netem delay 10ms loss 1%

docker exec peer4.org1.example.com apk add iproute2
docker exec -it peer4.org1.example.com tc qdisc add dev eth0 root netem delay 0ms
docker exec -it peer4.org1.example.com tc qdisc change dev eth0 root netem delay 10ms loss 1%

docker exec orderer.example.com apk add iproute2
docker exec -it orderer.example.com tc qdisc add dev eth0 root netem delay 0ms
docker exec -it orderer.example.com tc qdisc change dev eth0 root netem delay 10ms loss 1%




# node updateNetworkYaml.js

# npx caliper bind --caliper-bind-sut fabric:2.2 --caliper-bind-cwd ./ --caliper-bind-args="-g"

# docker exec peer0.org1.example.com apk add iproute2

# docker exec -it peer0.org1.example.com tc qdisc add dev eth0 root netem delay 0ms
# docker exec -it peer0.org1.example.com tc qdisc change dev eth0 root netem delay $1ms loss $2%

# npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig test-network.yaml --caliper-benchconfig benchmarks/basic/config.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled --caliper-fabric-gateway-discovery | tee test.log

# sudo npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig benchmarks/test-network.yaml --caliper-benchconfig benchmarks/basic/config.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled --caliper-fabric-gateway-discovery

# docker logs peer0.org1.example.com --since 2022-07-11 2>&1 | grep callChaincode >> peer.log
# docker logs peer1.org1.example.com --since 2022-07-11 2>&1 | grep callChaincode >> peer.log
# docker logs peer2.org1.example.com --since 2022-07-11 2>&1 | grep callChaincode >> peer.log

# node dealTx.js > $1ms$2%result.log

# mv report.html report$1ms$2%.html
# cp report$1ms$2%.html ../../../mnt/hgfs/GitHub/result/
# mv result.log result$1ms$2%.log
# cp result$1ms$2%.log ../../../mnt/hgfs/GitHub/result/

# docker exec -it peer0.org1.example.com tc qdisc show dev eth0
