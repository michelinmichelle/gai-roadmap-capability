@echo off
setlocal

rem 设置环境变量
set PORT=3000
set API_PORT=3001

rem 启动应用
if "生产"=="生产" (
    echo 以生产模式启动...
    start /B npx serve -s build -l 3000
    cd server && start /B node index.js
) else (
    echo 以开发模式启动...
    npm run dev
)

echo 应用已启动:
echo - 前端: http://localhost:3000
echo - API: http://localhost:3001
