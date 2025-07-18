#!/bin/bash

# 显示欢迎信息
echo "==================================================="
echo "       GAI平台技术路线图 (Tech) - 启动脚本         "
echo "==================================================="
echo ""

# 进入项目目录
cd "$(dirname "$0")"

# 检查Node.js和npm是否已安装
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
  echo "错误: 未安装Node.js或npm。请先安装Node.js和npm。"
  exit 1
fi

# 安装依赖
echo "正在安装依赖..."
npm install

# 启动开发服务器
echo "正在启动React开发服务器 (demo-gai-roadmap_0_Tech)..."
npm start

# 如果上述命令失败，尝试使用npx
if [ $? -ne 0 ]; then
  echo "尝试使用npx启动..."
  npx react-scripts start
fi 