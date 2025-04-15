#!/bin/bash

set -e

# ========== 环境变量 ==========
INSTALL_BASE=/home/kafkadmin
KAFKA_DIR=$INSTALL_BASE/kafka
PLUGIN_DIR=$KAFKA_DIR/connect-plugins
DEBEZIUM_VER=2.5.1.Final
JDBC_VER=10.7.0

# SQL Server 配置（请替换为你自己的）
AZURE_HOSTNAME="your-sqlserver-host.database.windows.net"
USERNAME="your_username"
PASSWORD="your_password"
TABLE_NAME="dbo.YourTable"
PRIMARY_KEY="id"

# ========== 创建目录 ==========
echo "📁 创建 Kafka 安装目录..."
mkdir -p $INSTALL_BASE
cd $INSTALL_BASE

# ========== 下载并解压 Kafka ==========
echo "⬇️ 下载 Kafka 3.8.1..."
curl -LO https://downloads.apache.org/kafka/3.8.1/kafka_2.13-3.8.1.tgz
tar -xzf kafka_2.13-3.8.1.tgz
rm -rf kafka  # 清除旧目录
mv kafka_2.13-3.8.1 kafka

# ========== 配置 KRaft 模式 ==========
echo "⚙️ 配置 Kafka KRaft 模式..."
mkdir -p $KAFKA_DIR/data/kraft-logs
cat > $KAFKA_DIR/config/kraft/server.properties <<EOF
process.roles=broker,controller
node.id=1
controller.quorum.voters=1@localhost:9093
log.dirs=$KAFKA_DIR/data/kraft-logs

listeners=PLAINTEXT://:9092,CONTROLLER://:9093
inter.broker.listener.name=PLAINTEXT
controller.listener.names=CONTROLLER

listener.security.protocol.map=PLAINTEXT:PLAINTEXT,CONTROLLER:PLAINTEXT
advertised.listeners=PLAINTEXT://localhost:9092
EOF

$KAFKA_DIR/bin/kafka-storage.sh format -t $($KAFKA_DIR/bin/kafka-storage.sh random-uuid) -c $KAFKA_DIR/config/kraft/server.properties

# ========== 下载 Debezium SQL Server Connector ==========
echo "🔌 下载 Debezium SQL Server Connector..."
mkdir -p $PLUGIN_DIR/debezium
cd $PLUGIN_DIR/debezium
curl -LO https://repo1.maven.org/maven2/io/debezium/debezium-connector-sqlserver/$DEBEZIUM_VER/debezium-connector-sqlserver-$DEBEZIUM_VER-plugin.tar.gz
tar -xzf debezium-connector-sqlserver-$DEBEZIUM_VER-plugin.tar.gz

# ========== 下载 Confluent JDBC Sink Connector ==========
echo "🔌 下载 Confluent JDBC Sink Connector..."
mkdir -p $PLUGIN_DIR/jdbc
cd $PLUGIN_DIR/jdbc
curl -LO https://packages.confluent.io/maven/io/confluent/kafka-connect-jdbc/$JDBC_VER/kafka-connect-jdbc-$JDBC_VER.jar
curl -LO https://repo1.maven.org/maven2/com/microsoft/sqlserver/mssql-jdbc/11.2.0.jre11/mssql-jdbc-11.2.0.jre11.jar

# ========== Kafka Connect 配置 ==========
echo "🧩 配置 Kafka Connect..."
cat > $KAFKA_DIR/config/connect-distributed.properties <<EOF
bootstrap.servers=localhost:9092
group.id=connect-cluster

key.converter=org.apache.kafka.connect.json.JsonConverter
value.converter=org.apache.kafka.connect.json.JsonConverter
key.converter.schemas.enable=true
value.converter.schemas.enable=true

config.storage.topic=connect-configs
offset.storage.topic=connect-offsets
status.storage.topic=connect-status

config.storage.replication.factor=1
offset.storage.replication.factor=1
status.storage.replication.factor=1

plugin.path=$PLUGIN_DIR/debezium,$PLUGIN_DIR/jdbc
EOF

# ========== 启动 Kafka 和 Connect ==========
echo "🚀 启动 Kafka（后台运行）..."
nohup $KAFKA_DIR/bin/kafka-server-start.sh $KAFKA_DIR/config/kraft/server.properties > $INSTALL_BASE/kafka.log 2>&1 &

sleep 10

echo "🚀 启动 Kafka Connect（后台运行）..."
nohup $KAFKA_DIR/bin/connect-distributed.sh $KAFKA_DIR/config/connect-distributed.properties > $INSTALL_BASE/connect.log 2>&1 &

sleep 20
echo "✅ Kafka & 数据同步系统部署完成！"
echo "📌 请检查 http://localhost:8083/connectors 查看状态"
