#!/bin/bash

# 添加终端颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

# 启用错误追踪
set -e

# 设置环境变量
export NODE_ENV=production
export PORT=3001
export FRONTEND_PORT=3000
export HOST="0.0.0.0"
export FRONTEND_HOST="0.0.0.0"
export REACT_APP_API_URL="http://0.0.0.0:3001"

# 标题
echo -e "${BLUE}===== 启动 GAI 平台技术路线图应用 =====${NC}"
echo -e "环境: ${NODE_ENV}"
echo -e "后端端口: ${PORT} (监听地址: ${HOST})"
echo -e "前端端口: ${FRONTEND_PORT} (监听地址: ${FRONTEND_HOST})"

# 清理可能存在的旧进程和日志文件
function cleanup {
    echo -e "${YELLOW}正在清理进程和日志...${NC}"
    
    # 杀死可能存在的node进程
    pkill -f "node.*index.js" 2>/dev/null || true
    pkill -f "serve.*build" 2>/dev/null || true
    
    # 删除日志文件
    rm -f api.log frontend.log
}

# 捕获SIGINT和SIGTERM信号
trap cleanup SIGINT SIGTERM

# 初始化清理
cleanup

# 检查端口是否已被使用 - 使用更通用的方法
echo -e "${BLUE}===== 检查并释放端口 =====${NC}"

check_port() {
    # 使用nc命令检查端口
    nc -z localhost $1 >/dev/null 2>&1
    return $?
}

# 使用更强大的方法释放端口
release_port() {
    local port=$1
    echo -e "${YELLOW}端口 ${port} 已被占用，使用多种方法尝试释放...${NC}"
    
    # 方法1: 使用pkill终止node进程
    echo -e "${YELLOW}尝试方法1: 终止相关进程...${NC}"
    if [ "$port" = "3001" ]; then
        pkill -f "node.*index.js" 2>/dev/null || true
    elif [ "$port" = "3000" ]; then
        pkill -f "serve.*build" 2>/dev/null || true
    fi
    sleep 1
    
    # 方法2: 使用fuser强制释放端口
    echo -e "${YELLOW}尝试方法2: 使用fuser释放端口...${NC}"
    fuser -k ${port}/tcp 2>/dev/null || true
    sleep 1
    
    # 方法3: 使用netstat查找并杀死特定进程
    echo -e "${YELLOW}尝试方法3: 使用netstat查找占用进程...${NC}"
    if command -v netstat >/dev/null 2>&1; then
        local pid=$(netstat -tlnp 2>/dev/null | grep ":${port} " | awk '{print $7}' | cut -d'/' -f1)
        if [ ! -z "$pid" ] && [ "$pid" != "-" ]; then
            echo -e "${YELLOW}找到进程 ${pid}，尝试终止...${NC}"
            kill -9 $pid 2>/dev/null || true
            sleep 1
        fi
    fi
    
    # 方法4: 使用lsof查找并杀死进程
    echo -e "${YELLOW}尝试方法4: 使用lsof查找占用进程...${NC}"
    if command -v lsof >/dev/null 2>&1; then
        local pids=$(lsof -i:${port} -t 2>/dev/null)
        if [ ! -z "$pids" ]; then
            echo -e "${YELLOW}找到进程 ${pids}，尝试终止...${NC}"
            kill -9 $pids 2>/dev/null || true
            sleep 1
        fi
    fi
    
    # 再次检查端口
    if ! check_port ${port}; then
        echo -e "${GREEN}端口 ${port} 已成功释放${NC}"
        return 0
    else
        # 如果还是无法释放，可以尝试使用不同端口
        if [ "$port" = "3001" ]; then
            local new_port=3002
            echo -e "${YELLOW}无法释放端口 ${port}，将尝试使用端口 ${new_port}${NC}"
            PORT=$new_port
            export PORT
            return 0
        elif [ "$port" = "3000" ]; then
            local new_port=3003
            echo -e "${YELLOW}无法释放端口 ${port}，将尝试使用端口 ${new_port}${NC}"
            FRONTEND_PORT=$new_port
            export FRONTEND_PORT
            return 0
        else
            echo -e "${RED}无法释放端口 ${port}，也无法切换到其他端口${NC}"
            return 1
        fi
    fi
}

# 检查后端API端口
if check_port $PORT; then
    if ! release_port $PORT; then
        echo -e "${RED}无法释放后端端口 ${PORT}，请手动检查并关闭占用此端口的进程${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}后端端口 ${PORT} 可用${NC}"
fi

# 检查前端端口
if check_port $FRONTEND_PORT; then
    if ! release_port $FRONTEND_PORT; then
        echo -e "${RED}无法释放前端端口 ${FRONTEND_PORT}，请手动检查并关闭占用此端口的进程${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}前端端口 ${FRONTEND_PORT} 可用${NC}"
fi

# 检查build目录是否存在
echo -e "${BLUE}===== 检查构建文件 =====${NC}"
if [ ! -d "./build" ]; then
    echo -e "${RED}错误: build目录不存在，请先运行 npm run build${NC}"
    exit 1
fi

if [ ! -f "./build/index.html" ]; then
    echo -e "${RED}错误: build/index.html 不存在，请检查构建是否成功${NC}"
    exit 1
fi

echo -e "${GREEN}构建文件检查通过${NC}"

# 确保数据目录存在并有正确权限
echo -e "${BLUE}===== 准备数据目录 =====${NC}"
mkdir -p data/backups
chmod -R 777 data/
mkdir -p src/data/backups
chmod -R 777 src/data/

# 启动服务
echo -e "${BLUE}===== 启动后端服务 =====${NC}"

# 启动API服务
node server/index.js > api.log 2>&1 &
API_PID=$!
echo -e "后端服务进程ID: ${API_PID}"

# 使用nc检查端口是否打开
wait_for_service() {
    local port=$1
    local host=$2
    local attempts=0
    local max_attempts=30
    
    # 默认使用localhost，如果提供了host参数则使用指定host
    if [ -z "$host" ]; then
        host="localhost"
    fi
    
    echo -e "${YELLOW}等待服务在 ${host}:${port} 启动...${NC}"
    
    while ! nc -z $host $port >/dev/null 2>&1; do
        attempts=$((attempts+1))
        if [ $attempts -ge $max_attempts ]; then
            return 1
        fi
        sleep 1
        echo -n "."
    done
    echo ""
    return 0
}

# 等待后端服务启动
echo -e "${YELLOW}等待后端服务启动在端口 ${PORT}...${NC}"

if wait_for_service $PORT; then
    echo -e "${GREEN}后端服务已成功启动！${NC}"
    
    # 测试健康检查端点
    echo -e "${YELLOW}测试后端健康检查端点...${NC}"
    curl -s http://localhost:${PORT}/health || echo -e "${RED}健康检查请求失败${NC}"
    
    echo -e "\n${GREEN}后端服务健康检查完成${NC}"
else
    echo -e "${RED}后端服务启动失败或超时${NC}"
    cat api.log
    exit 1
fi

# 启动前端服务
echo -e "${BLUE}===== 启动前端服务 =====${NC}"
if command -v serve >/dev/null 2>&1; then
    serve -s build -l ${FRONTEND_PORT} > frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo -e "前端服务进程ID: ${FRONTEND_PID}"
else
    if command -v npx >/dev/null 2>&1; then
        npx serve -s build -l ${FRONTEND_PORT} > frontend.log 2>&1 &
        FRONTEND_PID=$!
        echo -e "前端服务进程ID: ${FRONTEND_PID}"
    else
        echo -e "${YELLOW}未找到serve命令，尝试使用npm安装...${NC}"
        npm install -g serve
        serve -s build -l ${FRONTEND_PORT} > frontend.log 2>&1 &
        FRONTEND_PID=$!
        echo -e "前端服务进程ID: ${FRONTEND_PID}"
    fi
fi

# 等待前端服务启动
echo -e "${YELLOW}等待前端服务启动在端口 ${FRONTEND_PORT}...${NC}"
if wait_for_service $FRONTEND_PORT $FRONTEND_HOST; then
    echo -e "${GREEN}前端服务已成功启动！${NC}"
else
    echo -e "${RED}前端服务启动失败或超时${NC}"
    cat frontend.log
    # 前端启动失败不影响整体应用，继续执行
fi

# 打印网络信息
echo -e "${BLUE}===== 网络信息 =====${NC}"
ip addr show | grep inet
netstat -tulpn | grep -E ":${PORT}|:${FRONTEND_PORT}" || true

# 成功启动消息
echo -e "${BLUE}===== 服务已成功启动 =====${NC}"
echo -e "- 后端服务地址: http://0.0.0.0:${PORT}"
echo -e "- 健康检查: http://0.0.0.0:${PORT}/health"
echo -e "- 前端服务地址: http://0.0.0.0:${FRONTEND_PORT}"
echo -e "${YELLOW}使用 Ctrl+C 停止所有服务${NC}"

# 实时显示日志
echo -e "${BLUE}===== 实时日志 =====${NC}"
echo -e "${GREEN}后端服务日志:${NC}"
tail -f api.log
