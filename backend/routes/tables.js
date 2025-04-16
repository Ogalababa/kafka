// routes/tables.js
const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('📥 收到 GET /tables 请求');
    res.json({ message: '✅ Back-end API is running（GET /tables）' });
});

router.post('/', async (req, res) => {
    const {
        hostname,
        port,
        databaseName,
        "connection.user": user,
        "connection.password": password
    } = req.body;

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
      SELECT TABLE_SCHEMA, TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
    `);

        const tables = result.recordset.map(row => `${row.TABLE_SCHEMA}.${row.TABLE_NAME}`);
        res.json(tables);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database connection or query failed' });
    }
});

module.exports = router;
