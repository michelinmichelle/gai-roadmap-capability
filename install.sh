#!/bin/bash

# 设置错误时退出
set -e

# 彩色输出函数
print_green() {
    echo -e "\033[0;32m$1\033[0m"
}

print_yellow() {
    echo -e "\033[0;33m$1\033[0m"
}

print_red() {
    echo -e "\033[0;31m$1\033[0m"
}

# 显示帮助信息
show_help() {
    echo "GAI平台技术路线图 - 安装脚本"
    echo "用法: $0 [选项]"
    echo "选项:"
    echo "  -h, --help                  显示帮助信息"
    echo "  -p, --port <端口>           设置前端端口 (默认: 3000)"
    echo "  -a, --api-port <端口>       设置API端口 (默认: 3001)"
    echo "  -e, --env <环境>            设置环境 (开发|生产, 默认: 生产)"
    echo "  -i, --install-only          仅安装依赖不启动服务"
}

# 默认参数
FRONTEND_PORT=3000
API_PORT=3001
ENVIRONMENT="生产"
INSTALL_ONLY=false

# 解析命令行参数
while [ "$1" != "" ]; do
    case $1 in
        -p | --port )           shift
                                FRONTEND_PORT=$1
                                ;;
        -a | --api-port )       shift
                                API_PORT=$1
                                ;;
        -e | --env )            shift
                                ENVIRONMENT=$1
                                ;;
        -i | --install-only )   INSTALL_ONLY=true
                                ;;
        -h | --help )           show_help
                                exit
                                ;;
        * )                     print_red "未知参数: $1"
                                show_help
                                exit 1
    esac
    shift
done

# 获取当前目录
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
cd "$SCRIPT_DIR"

# 检测操作系统
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="Linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="MacOS"
    elif [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        OS="Windows"
    else
        OS="未知"
    fi
    print_yellow "检测到操作系统: $OS"
}

# 检查Node.js和npm
check_node() {
    print_yellow "检查Node.js环境..."
    
    if ! command -v node &> /dev/null; then
        print_red "未找到Node.js，请先安装Node.js (v14+)"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_red "未找到npm，请先安装npm"
        exit 1
    fi
    
    NODE_VERSION=$(node -v)
    NPM_VERSION=$(npm -v)
    print_green "Node.js版本: $NODE_VERSION"
    print_green "npm版本: $NPM_VERSION"
}

# 安装依赖
install_dependencies() {
    print_yellow "安装依赖..."
    npm ci
    
    if [ $? -ne 0 ]; then
        print_yellow "npm ci失败，尝试使用npm install..."
        npm install
    fi
    
    print_green "依赖安装完成"
}

# 创建环境配置文件
create_env_file() {
    print_yellow "创建环境配置文件..."
    
    # 创建.env文件
    cat > .env <<EOL
# 环境配置
NODE_ENV=${ENVIRONMENT}
REACT_APP_API_URL=http://localhost:${API_PORT}
PORT=${FRONTEND_PORT}
API_PORT=${API_PORT}
EOL
    
    print_green ".env文件已创建"
}

# 创建产品构建
build_production() {
    if [ "$ENVIRONMENT" == "生产" ]; then
        print_yellow "构建生产环境应用..."
        npm run build
        print_green "构建完成"
    fi
}

# 生成服务启动文件
create_start_script() {
    print_yellow "创建启动脚本..."
    
    # 创建启动脚本
    cat > start.sh <<EOL
#!/bin/bash

# 设置环境变量
export PORT=${FRONTEND_PORT}
export API_PORT=${API_PORT}

# 检查端口占用情况
check_port() {
    if command -v lsof &> /dev/null; then
        lsof -i:$1 &> /dev/null
        return $?
    elif command -v netstat &> /dev/null; then
        netstat -tuln | grep $1 &> /dev/null
        return $?
    fi
    return 1
}

cleanup_port() {
    local port=\$1
    if check_port \$port; then
        echo "端口 \$port 被占用，尝试释放..."
        if command -v lsof &> /dev/null; then
            local pid=\$(lsof -ti:\$port)
            if [ ! -z "\$pid" ]; then
                echo "停止进程 \$pid..."
                kill -9 \$pid
                sleep 1
            fi
        fi
    fi
}

# 清理端口
cleanup_port ${FRONTEND_PORT}
cleanup_port ${API_PORT}

# 启动应用
if [ "$ENVIRONMENT" == "生产" ]; then
    echo "以生产模式启动..."
    npx serve -s build -l ${FRONTEND_PORT} &
    cd server && node index.js &
else
    echo "以开发模式启动..."
    npm run dev
fi

echo "应用已启动:"
echo "- 前端: http://localhost:${FRONTEND_PORT}"
echo "- API: http://localhost:${API_PORT}"
EOL
    
    chmod +x start.sh
    print_green "启动脚本已创建: start.sh"
    
    # 为Windows创建bat文件
    cat > start.bat <<EOL
@echo off
setlocal

rem 设置环境变量
set PORT=${FRONTEND_PORT}
set API_PORT=${API_PORT}

rem 启动应用
if "${ENVIRONMENT}"=="生产" (
    echo 以生产模式启动...
    start /B npx serve -s build -l ${FRONTEND_PORT}
    cd server && start /B node index.js
) else (
    echo 以开发模式启动...
    npm run dev
)

echo 应用已启动:
echo - 前端: http://localhost:${FRONTEND_PORT}
echo - API: http://localhost:${API_PORT}
EOL
    
    print_green "Windows启动脚本已创建: start.bat"
}

# 主执行流程
main() {
    print_green "========== GAI平台技术路线图部署脚本 =========="
    print_yellow "前端端口: $FRONTEND_PORT"
    print_yellow "API端口: $API_PORT"
    print_yellow "环境: $ENVIRONMENT"
    
    detect_os
    check_node
    install_dependencies
    create_env_file
    build_production
    create_start_script
    
    if [ "$INSTALL_ONLY" = false ]; then
        print_yellow "启动应用..."
        chmod +x start.sh
        ./start.sh
    else
        print_green "=== 安装完成 ==="
        print_green "使用以下命令启动应用:"
        print_green "  Linux/MacOS: ./start.sh"
        print_green "  Windows: start.bat"
    fi
}

# 执行主函数
main 