#!/bin/bash

# 设置路径
KAFKA_HOME=/home/kafkadmin/kafka
KAFKA_LOG=/home/kafkadmin/kafka.log
CONNECT_LOG=/home/kafkadmin/connect.log

echo "🚀 启动 Kafka..."
nohup $KAFKA_HOME/bin/kafka-server-start.sh $KAFKA_HOME/config/kraft/server.properties > $KAFKA_LOG 2>&1 &

sleep 10

echo "🚀 启动 Kafka Connect..."
nohup $KAFKA_HOME/bin/connect-distributed.sh $KAFKA_HOME/config/connect-distributed.properties > $CONNECT_LOG 2>&1 &

