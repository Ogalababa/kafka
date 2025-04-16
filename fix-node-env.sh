#!/bin/bash

echo "🔧 正在修复 Node/NVM 环境..."

# 1. 确保 NVM 目录存在
export NVM_DIR="$HOME/.nvm"

# 2. 加载 nvm（如果没加载）
if [ -s "$NVM_DIR/nvm.sh" ]; then
  echo "✅ 加载 NVM..."
  . "$NVM_DIR/nvm.sh"
else
  echo "❌ 未找到 NVM，请先安装 NVM"
  exit 1
fi

# 3. 切换到 Node 20（如果未安装会自动安装）
echo "📦 使用 Node 20"
nvm install 20
nvm use 20
nvm alias default 20

# 4. 安装最新版 npm
echo "📥 安装最新 npm..."
nvm install-latest-npm

# 5. 确保 .bashrc 中有自动切换配置
if ! grep -q 'nvm use 20' "$HOME/.bashrc"; then
  echo "⚙️ 更新 ~/.bashrc 添加自动切换 Node 20"
  echo -e "\n# Auto switch to Node 20 on login\nnvm use 20 > /dev/null" >> "$HOME/.bashrc"
fi

# 6. 更新全局软链接（可选）
echo "🔗 设置 /usr/bin/node 和 /usr/bin/npm 链接..."
NODE_PATH="$(which node)"
NPM_PATH="$(which npm)"
sudo ln -sf "$NODE_PATH" /usr/bin/node
sudo ln -sf "$NPM_PATH" /usr/bin/npm

echo "✅ Node 版本: $(node -v)"
echo "✅ NPM 版本: $(npm -v)"
echo "✅ 修复完成！"

echo "📌 提示：执行 'source ~/.bashrc' 或重新登录终端使配置生效"

