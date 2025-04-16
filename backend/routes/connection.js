// routes/connection.js
const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.post('/database-login', async (req, res) => {
    const {
        hostname,
        port,
        databaseName,
        'connection.user': user,
        'connection.password': password
    } = req.body;

    const config = {
        server: hostname,
        port: parseInt(port),
        database: databaseName,
        user,
        password,
        options: {
            trustServerCertificate: true
        }
    };

    try {
        await sql.connect(config);
        res.json({ success: true });
    } catch (err) {
        console.error('❌ Database login failed:', err.message);
        res.json({ success: false, error: err.message });
    }
});

module.exports = router;
