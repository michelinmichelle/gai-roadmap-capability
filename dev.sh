#!/bin/bash

# 确保脚本在错误时退出
set -e

# 定义端口号
FRONTEND_PORT=3000
BACKEND_PORT=3001

# 检查并安装依赖
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
fi

# 清理端口占用的函数
cleanup_port() {
    local port=$1
    local pid=$(lsof -ti :$port)
    if [ ! -z "$pid" ]; then
        echo "端口 $port 被占用，正在停止进程 $pid..."
        kill -9 $pid
        sleep 1
    fi
}

# 清理前端和后端端口
echo "检查端口占用情况..."
cleanup_port $FRONTEND_PORT
cleanup_port $BACKEND_PORT

# 启动开发环境
echo "启动开发环境..."
echo "启动后端服务器..."
BACKEND_PORT=$BACKEND_PORT node server/index.js &
BACKEND_PID=$!
echo "后端服务器已启动，PID: $BACKEND_PID"

echo "启动前端服务器..."
# 修改为允许公网访问的设置
export DANGEROUSLY_DISABLE_HOST_CHECK=true
export HOST=0.0.0.0
export WDS_SOCKET_PORT=0
npx react-scripts start --host 0.0.0.0 --port $FRONTEND_PORT --public egpkqoqxwawl.usw.sealos.io --disable-host-check &
FRONTEND_PID=$!
echo "前端服务器已启动，PID: $FRONTEND_PID"

# 捕获 Ctrl+C 信号，清理进程
trap 'echo "正在停止服务..."; kill $FRONTEND_PID $BACKEND_PID 2>/dev/null; cleanup_port $FRONTEND_PORT; cleanup_port $BACKEND_PORT; exit 0' SIGINT 