#!/bin/bash

# 设置环境变量
export PORT=3000
export API_PORT=3001

# 检查端口占用情况
check_port() {
    if command -v lsof &> /dev/null; then
        lsof -i: &> /dev/null
        return 0
    elif command -v netstat &> /dev/null; then
        netstat -tuln | grep  &> /dev/null
        return 0
    fi
    return 1
}

cleanup_port() {
    local port=$1
    if check_port $port; then
        echo "端口 $port 被占用，尝试释放..."
        if command -v lsof &> /dev/null; then
            local pid=$(lsof -ti:$port)
            if [ ! -z "$pid" ]; then
                echo "停止进程 $pid..."
                kill -9 $pid
                sleep 1
            fi
        fi
    fi
}

# 清理端口
cleanup_port 3000
cleanup_port 3001

# 启动应用
if [ "生产" == "生产" ]; then
    echo "以生产模式启动..."
    npx serve -s build -l 3000 &
    cd server && node index.js &
else
    echo "以开发模式启动..."
    npm run dev
fi

echo "应用已启动:"
echo "- 前端: http://localhost:3000"
echo "- API: http://localhost:3001"
