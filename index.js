const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();

// 增强的 CORS 配置
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', '*'], // 允许的域名列表，可添加生产环境域名
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // 允许携带凭证（cookies等）
    maxAge: 86400 // 预检请求缓存时间（秒）
}));

// 解析 JSON 请求体
app.use(express.json({ limit: '50mb' }));

// 全局请求日志中间件
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// API 返回工具函数
const sendResponse = (res, data, statusCode = 200) => {
    res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300,
        data,
        timestamp: new Date().toISOString()
    });
};

const sendError = (res, error, statusCode = 500) => {
    console.error(`[API Error] ${error.message || error}`);
    res.status(statusCode).json({
        success: false,
        error: {
            message: error.message || '未知错误',
            code: error.code || 'INTERNAL_SERVER_ERROR',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        timestamp: new Date().toISOString()
    });
};

// 获取架构数据的端点
app.get('/api/get-architecture', async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../src/data/architecture-cards.json');
        const data = await fs.readFile(filePath, 'utf8');
        sendResponse(res, JSON.parse(data));
    } catch (error) {
        console.error('读取文件失败:', error);
        sendError(res, { message: '读取架构数据失败', details: error.message }, 500);
    }
});

// 获取备份版本列表
app.get('/api/architecture-versions', async (req, res) => {
    try {
        const backupDir = path.join(__dirname, '../data/backups');
        await fs.mkdir(backupDir, { recursive: true });

        const files = await fs.readdir(backupDir);
        const versions = files
            .filter(file => file.startsWith('architecture-cards-'))
            .map(file => {
                const timestamp = file.replace('architecture-cards-', '').replace('.json', '');
                return {
                    file,
                    timestamp,
                    date: new Date(timestamp.replace(/-/g, ':')).toLocaleString()
                };
            })
            .sort((a, b) => new Date(b.timestamp.replace(/-/g, ':')) - new Date(a.timestamp.replace(/-/g, ':')));

        sendResponse(res, versions);
    } catch (error) {
        sendError(res, { message: '获取版本列表失败', details: error.message }, 500);
    }
});

// 获取指定版本的架构数据
app.get('/api/architecture-version/:file', async (req, res) => {
    try {
        const fileName = req.params.file;
        // 安全检查，确保文件名合法
        if (!fileName || !fileName.match(/^architecture-cards-[\d-]+T[\d-]+Z\.json$/)) {
            return sendError(res, { message: '无效的文件名', code: 'INVALID_FILENAME' }, 400);
        }

        const filePath = path.join(__dirname, '../data/backups', fileName);
        const data = await fs.readFile(filePath, 'utf8');
        sendResponse(res, JSON.parse(data));
    } catch (error) {
        if (error.code === 'ENOENT') {
            sendError(res, { message: '找不到请求的版本文件', code: 'FILE_NOT_FOUND' }, 404);
        } else {
            sendError(res, { message: '读取版本失败', details: error.message }, 500);
        }
    }
});

// 保存架构数据的端点
app.post('/api/save-architecture', async (req, res) => {
    try {
        // 验证请求体
        if (!req.body || !req.body.sections) {
            return sendError(res, { message: '无效的数据格式', code: 'INVALID_DATA' }, 400);
        }

        // 添加时间戳作为版本
        const version = new Date().toISOString();
        const versionedData = {
            ...req.body,
            _metadata: {
                version,
                lastUpdated: new Date().toISOString()
            }
        };

        // 保存主数据文件
        const filePath = path.join(__dirname, '../src/data/architecture-cards.json');
        await fs.writeFile(filePath, JSON.stringify(versionedData, null, 4), 'utf8');

        // 保存备份文件
        const backupDir = path.join(__dirname, '../data/backups');
        await fs.mkdir(backupDir, { recursive: true });
        await fs.writeFile(
            path.join(backupDir, `architecture-cards-${version}.json`),
            JSON.stringify(versionedData, null, 4),
            'utf8'
        );

        console.log('架构数据已成功保存');
        sendResponse(res, { version, message: '保存成功' });
    } catch (error) {
        sendError(res, { message: '保存数据失败', details: error.message }, 500);
    }
});

// 获取能力地图数据的端点
app.get('/api/get-capability-map/:sectionId', async (req, res) => {
    try {
        const { sectionId } = req.params;
        // 安全检查，确保sectionId合法
        if (!sectionId || !sectionId.match(/^[a-zA-Z0-9_-]+$/)) {
            return sendError(res, { message: '无效的sectionId', code: 'INVALID_SECTION_ID' }, 400);
        }

        const filePath = path.join(__dirname, `../src/data/capability-maps/${sectionId}.json`);
        try {
            const data = await fs.readFile(filePath, 'utf8');
            sendResponse(res, JSON.parse(data));
        } catch (fileError) {
            if (fileError.code === 'ENOENT') {
                sendError(res, { message: `找不到能力地图: ${sectionId}`, code: 'MAP_NOT_FOUND' }, 404);
            } else {
                throw fileError;
            }
        }
    } catch (error) {
        sendError(res, { message: '读取能力地图失败', details: error.message }, 500);
    }
});

// 保存能力地图数据的端点
app.post('/api/save-capability-map/:sectionId', async (req, res) => {
    try {
        const { sectionId } = req.params;
        // 安全检查，确保sectionId合法
        if (!sectionId || !sectionId.match(/^[a-zA-Z0-9_-]+$/)) {
            return sendError(res, { message: '无效的sectionId', code: 'INVALID_SECTION_ID' }, 400);
        }

        // 验证请求体
        if (!req.body) {
            return sendError(res, { message: '无效的数据格式', code: 'INVALID_DATA' }, 400);
        }

        // 根据sectionId确定保存路径
        let dirPath;

        // 支持新的路径结构 - 新格式目录优先
        if (['admintouchpoints', 'aiorchestrator'].includes(sectionId)) {
            dirPath = path.join(__dirname, `../src/data/capabilitymaps/${sectionId}`);
        } else {
            dirPath = path.join(__dirname, '../src/data/capability-maps');
        }

        await fs.mkdir(dirPath, { recursive: true });

        // 确定文件路径和文件内容
        let filePath;
        let fileContent;

        if (typeof req.body === 'object' && req.body !== null) {
            if (['admintouchpoints', 'aiorchestrator'].includes(sectionId)) {
                // 对于新格式，处理可能有多个文件的情况
                if (req.query.filePath) {
                    // 如果指定了特定文件路径
                    const safeFilePath = req.query.filePath.replace(/\.\./g, ''); // 防止路径遍历
                    const fullDirPath = path.join(dirPath, path.dirname(safeFilePath));
                    await fs.mkdir(fullDirPath, { recursive: true });
                    filePath = path.join(dirPath, safeFilePath);
                    fileContent = JSON.stringify(req.body, null, 4);
                } else {
                    // 如果是整个部分的数据
                    for (const [key, value] of Object.entries(req.body)) {
                        const itemPath = path.join(dirPath, `${key}.json`);
                        await fs.writeFile(itemPath, JSON.stringify(value, null, 4), 'utf8');
                    }
                    filePath = dirPath;
                    fileContent = null; // 已经分别保存了各个文件
                }
            } else {
                // 旧格式处理 - 整个部分保存为一个文件
                filePath = path.join(dirPath, `${sectionId}.json`);
                fileContent = JSON.stringify(req.body, null, 4);
            }

            // 保存文件（如果需要）
            if (fileContent && filePath) {
                await fs.writeFile(filePath, fileContent, 'utf8');
            }

            console.log(`能力地图数据已成功保存: ${sectionId}`);
            sendResponse(res, { message: '保存成功' });
        } else {
            sendError(res, { message: '无效的数据格式', code: 'INVALID_DATA' }, 400);
        }
    } catch (error) {
        console.error('保存能力地图错误:', error);
        sendError(res, { message: '保存能力地图失败', details: error.message }, 500);
    }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
    sendResponse(res, { status: 'ok', serverTime: new Date().toISOString() });
});

// 为API路由添加前缀
app.use('/api/*', (req, res, next) => {
    if (req.method === 'OPTIONS') {
        // 处理预检请求
        res.status(200).end();
    } else {
        next();
    }
});

// 404错误处理
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        sendError(res, { message: '未找到请求的API端点', code: 'API_NOT_FOUND' }, 404);
    } else {
        next();
    }
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    sendError(res, { message: '服务器内部错误', details: err.message }, 500);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
}); 