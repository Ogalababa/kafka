const express = require('express');
const sql = require('mssql');
const app = express();
const PORT = 5000;

// 支持 JSON body 解析
app.use(express.json());

// 后端 API 版本：POST /api/tables
app.post('/api/tables', async (req, res) => {
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
    options: {
      trustServerCertificate: true
    }
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

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}/api/tables`);
});
