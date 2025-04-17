// routes/addconnector.js (Production version)
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
    const {
        connectorName,
        sourceDatabase,
        selectedTable,
        selectedColumns,
        sinkDatabases
    } = req.body;

    const [schema, tableName] = selectedTable.split('.');

    // ✅ 构建 Source Connector 配置
    const sourceConnectorConfig = {
        name: `source-${sourceDatabase.databaseName}-${connectorName}`,
        config: {
            "connector.class": "io.debezium.connector.sqlserver.SqlServerConnector",
            "tasks.max": "1",
            "database.hostname": sourceDatabase.hostname,
            "database.port": sourceDatabase.port,
            "database.user": sourceDatabase["connection.user"],
            "database.password": sourceDatabase["connection.password"],
            "database.names": sourceDatabase.databaseName,
            "database.server.name": connectorName,
            "table.include.list": selectedTable,
            "column.include.list": selectedColumns.map(col => `${selectedTable}.${col}`).join(','),
            "database.encrypt": "false",
            "database.trustServerCertificate": "true",
            "schema.history.internal.kafka.bootstrap.servers": "localhost:9092",
            "schema.history.internal.kafka.topic": `schema-changes.${selectedTable}`,
            "include.schema.changes": "false",
            "snapshot.mode": "initial",
            "decimal.handling.mode": "double",
            "time.precision.mode": "adaptive_time_microseconds",
            "topic.prefix": connectorName,
            "topic.naming.strategy": "io.debezium.schema.DefaultTopicNamingStrategy"
        }
    };

    // ✅ 构建 Sink Connectors 配置列表
    const sinkConnectorConfigs = sinkDatabases.map((sink) => ({
        name: `sink-${sink.databaseName}-${connectorName}`,
        config: {
            "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
            "tasks.max": "1",
            "topics": `${connectorName}.${sourceDatabase.databaseName}.${tableName}`,
            "connection.url": `jdbc:sqlserver://${sink.hostname}:${sink.port};databaseName=${sink.databaseName};encrypt=false;trustServerCertificate=true`,
            "connection.user": sink["connection.user"],
            "connection.password": sink["connection.password"],
            "insert.mode": "upsert",
            "pk.mode": "record_key",
            "pk.fields": selectedColumns.find(col => col.toLowerCase().includes("id")) || selectedColumns[0],
            "auto.create": "true",
            "auto.evolve": "true",
            "delete.enabled": "false",
            "table.name.format": tableName,
            "transforms": "unwrap,filterFields",
            "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
            "transforms.unwrap.drop.tombstones": "true",
            "transforms.unwrap.delete.handling.mode": "drop",
            "transforms.filterFields.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
            "transforms.filterFields.whitelist": selectedColumns.join(','),
            "errors.tolerance": "all",
            "errors.log.enable": "true",
            "errors.log.include.messages": "true"
        }
    }));

    try {
        const sourceResp = await axios.post('http://localhost:8083/connectors/', sourceConnectorConfig);

        const sinkResponses = [];
        for (const sinkConfig of sinkConnectorConfigs) {
            const response = await axios.post('http://localhost:8083/connectors/', sinkConfig);
            sinkResponses.push({ name: sinkConfig.name, status: response.status, data: response.data });
        }

        res.status(201).json({
            message: '✅ All connectors created successfully!',
            sourceResponse: sourceResp.data,
            sinkResponses
        });
    } catch (err) {
        console.error('❌ Connector creation failed:', err.response?.data || err.message);
        res.status(err.response?.status || 500).json({
            error: '❌ Failed to create connector',
            detail: err.response?.data || err.message
        });
    }
});

module.exports = router;