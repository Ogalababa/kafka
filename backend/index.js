const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

// 挂载路由模块
app.use('/tables', require('./routes/tables'));
app.use('/columns', require('./routes/columns'));

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
