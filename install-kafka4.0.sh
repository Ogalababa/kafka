
#!/bin/bash

set -e

KAFKA_VERSION="4.0.0"
SCALA_VERSION="2.13"
KAFKA_DIR="/home/kafkadmin/kafka"
DOWNLOAD_URL="https://downloads.apache.org/kafka/${KAFKA_VERSION}/kafka_${SCALA_VERSION}-${KAFKA_VERSION}.tgz"
JDBC_PLUGIN_DIR="$KAFKA_DIR/plugins"
CONNECTOR_URL="https://packages.confluent.io/maven/io/confluent/kafka-connect-jdbc/10.7.0/kafka-connect-jdbc-10.7.0.jar"
MSSQL_JDBC_URL="https://repo1.maven.org/maven2/com/microsoft/sqlserver/mssql-jdbc/12.2.0.jre11/mssql-jdbc-12.2.0.jre11.jar"

echo "📦 下载 Kafka ${KAFKA_VERSION}..."
wget -q "$DOWNLOAD_URL" -O /tmp/kafka.tgz

echo "📂 解压并重命名目录..."
mkdir -p "$KAFKA_DIR"
tar -xzf /tmp/kafka.tgz -C /home/kafkadmin
mv /home/kafkadmin/kafka_${SCALA_VERSION}-${KAFKA_VERSION}/* "$KAFKA_DIR"
rm -rf /home/kafkadmin/kafka_${SCALA_VERSION}-${KAFKA_VERSION} /tmp/kafka.tgz

echo "🛠️  创建 Kafka 配置..."
mkdir -p "$KAFKA_DIR/data"
mkdir -p "$KAFKA_DIR/config/kraft"

cat <<EOF > "$KAFKA_DIR/config/kraft/server.properties"
process.roles=broker,controller
node.id=1
controller.quorum.voters=1@localhost:9093
listeners=PLAINTEXT://:9092,CONTROLLER://:9093
controller.listener.names=CONTROLLER
log.dirs=$KAFKA_DIR/data
num.network.threads=3
num.io.threads=8
log.retention.hours=168
log.segment.bytes=1073741824
log.retention.check.interval.ms=300000
EOF

echo "🛠️  初始化 Kafka 集群元数据..."
"$KAFKA_DIR/bin/kafka-storage.sh" format -t $(uuidgen) -c "$KAFKA_DIR/config/kraft/server.properties"

echo "🚀 启动 Kafka（KRaft 模式）..."
nohup "$KAFKA_DIR/bin/kafka-server-start.sh" "$KAFKA_DIR/config/kraft/server.properties" > /tmp/kafka.log 2>&1 &

echo "🔌 安装 JDBC 插件和驱动..."
mkdir -p "$JDBC_PLUGIN_DIR"
wget -q "$CONNECTOR_URL" -P "$JDBC_PLUGIN_DIR"
wget -q "$MSSQL_JDBC_URL" -P "$JDBC_PLUGIN_DIR"

echo "🛠️ 配置 Kafka Connect..."
cat <<EOF > "$KAFKA_DIR/config/connect-standalone.properties"
bootstrap.servers=localhost:9092
key.converter=org.apache.kafka.connect.json.JsonConverter
value.converter=org.apache.kafka.connect.json.JsonConverter
key.converter.schemas.enable=false
value.converter.schemas.enable=false
offset.storage.file.filename=/tmp/connect.offsets
plugin.path=$JDBC_PLUGIN_DIR
rest.port=8083
EOF

echo "🚀 启动 Kafka Connect..."
nohup "$KAFKA_DIR/bin/connect-standalone.sh" "$KAFKA_DIR/config/connect-standalone.properties" > /tmp/kafka-connect.log 2>&1 &

echo "✅ Kafka 和 Connect 安装完成！"

