#!/bin/bash

# 设置项目目录
APP_DIR="/home/kafkadmin/backend"
APP_NAME="backend-api"
ENTRY_FILE="index.js"

# 进入项目目录
cd "$APP_DIR" || exit

# 启动 PM2 进程
echo "🚀 启动 PM2 服务：$APP_NAME"
pm2 start "$ENTRY_FILE" --name "$APP_NAME"

# 保存进程状态
echo "💾 保存进程列表"
pm2 save

# 配置开机启动（仅需第一次执行）
echo "⚙️ 设置开机自启（若已设置会自动跳过）"
pm2 startup systemd -u $USER --hp $HOME | tail -n 1 | bash

echo "✅ 后端已启动并配置完成！"
pm2 status
