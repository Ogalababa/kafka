// routes/columns.js
const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.post('/', async (req, res) => {
    const {
        hostname,
        port,
        databaseName,
        "connection.user": user,
        "connection.password": password,
        "table.name": tableName
    } = req.body;

    const [schema, table] = tableName.split('.');

    const config = {
        server: hostname,
        port: parseInt(port),
        user,
        password,
        database: databaseName,
        options: { trustServerCertificate: true }
    };

    try {
        await sql.connect(config);

        const result = await sql.query(`
      SELECT 
        cols.COLUMN_NAME AS columnName,
        cols.DATA_TYPE AS dataType,
        CASE WHEN pk.COLUMN_NAME IS NOT NULL THEN 1 ELSE 0 END AS isPrimaryKey
      FROM INFORMATION_SCHEMA.COLUMNS cols
      LEFT JOIN (
          SELECT ku.TABLE_NAME, ku.COLUMN_NAME 
          FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
          JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE ku 
              ON tc.CONSTRAINT_NAME = ku.CONSTRAINT_NAME
          WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
            AND ku.TABLE_NAME = '${table}'
            AND ku.TABLE_SCHEMA = '${schema}'
      ) pk 
      ON cols.TABLE_NAME = pk.TABLE_NAME AND cols.COLUMN_NAME = pk.COLUMN_NAME
      WHERE cols.TABLE_NAME = '${table}' AND cols.TABLE_SCHEMA = '${schema}'
    `);

        const columns = result.recordset.map(row => ({
            columnName: row.columnName,
            dataType: row.dataType,
            isPrimaryKey: row.isPrimaryKey === 1
        }));

        res.json(columns);
    } catch (err) {
        console.error('❌ column query error:', err);
        res.status(500).json({ error: '列信息查询失败', detail: err.toString() });
    }
});

module.exports = router;
