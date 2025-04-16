const express = require('express');
const sql = require('mssql');
const router = express.Router();

// ✅ 测试 GET 路由
router.get('/database-login', (req, res) => {
    res.json({ message: '✅ Database login API is up and running!' });
});

// ✅ POST 检查是否 db_owner
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
        // 连接数据库
        await sql.connect(config);

        // 查询当前用户是否在 db_owner 角色中
        const result = await sql.query(`
            SELECT IS_ROLEMEMBER('db_owner') AS IsDbOwner
        `);

        const isOwner = result.recordset[0]?.IsDbOwner === 1;

        if (isOwner) {
            res.json({ success: true });
        } else {
            res.json({
                success: false,
                error: 'User is not a member of db_owner role.'
            });
        }
    } catch (err) {
        console.error('❌ Database login failed:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
