#!/bin/bash

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # 无颜色

# 打印带颜色的消息
print_message() {
  local color=$1
  local message=$2
  echo -e "${color}${message}${NC}"
}

print_message $GREEN "===== 快速重启 GAI 平台技术路线图应用 ====="

# 识别并终止现有服务
print_message $YELLOW "正在停止现有服务..."

# 停止Serve前端服务
if pgrep -f "serve -s build" > /dev/null; then
  print_message $YELLOW "找到前端服务进程，正在终止..."
  pkill -f "serve -s build"
  sleep 1
  print_message $GREEN "前端服务已停止"
else
  print_message $YELLOW "没有找到运行中的前端服务"
fi

# 停止后端Node服务
if pgrep -f "node.*server/index.js" > /dev/null; then
  print_message $YELLOW "找到后端服务进程，正在终止..."
  pkill -f "node.*server/index.js"
  sleep 1
  print_message $GREEN "后端服务已停止"
else
  print_message $YELLOW "没有找到运行中的后端服务"
fi

# 确保所有相关进程都已终止
# 终止日志tail进程
if pgrep -f "tail -f .*\.log" > /dev/null; then
  print_message $YELLOW "终止日志监控进程..."
  pkill -f "tail -f .*\.log"
fi

# 确保端口已释放
print_message $YELLOW "检查端口状态..."
port_check() {
  local port=$1
  local service_name=$2
  if nc -z 0.0.0.0 $port 2>/dev/null; then
    print_message $RED "警告: 端口 $port ($service_name) 仍被占用!"
    print_message $YELLOW "尝试强制释放端口 $port..."
    
    if command -v netstat >/dev/null 2>&1; then
      local pid=$(netstat -tlnp 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d'/' -f1)
      if [ ! -z "$pid" ] && [ "$pid" != "-" ]; then
        print_message $YELLOW "终止进程 $pid..."
        kill -9 $pid
        sleep 1
        print_message $GREEN "端口 $port 已释放"
      fi
    fi
  else
    print_message $GREEN "端口 $port ($service_name) 可用"
  fi
}

# 检查前端和后端端口
port_check 3000 "前端"
port_check 3001 "后端"

# 清理旧的日志文件
print_message $YELLOW "清理旧日志文件..."
rm -f api.log frontend.log

# 使用entrypoint.sh重启服务
print_message $GREEN "正在启动服务..."
./entrypoint.sh 