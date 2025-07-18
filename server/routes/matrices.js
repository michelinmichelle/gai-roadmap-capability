const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// 获取矩阵索引
router.get('/index', (req, res) => {
    try {
        const indexPath = path.join(__dirname, '../../src/data/capability-matrices/matrix-index.json');
        const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
        res.json(indexData);
    } catch (error) {
        console.error('Error fetching matrix index:', error);
        res.status(500).json({ error: 'Failed to fetch matrix index' });
    }
});

// 获取特定矩阵的内容
router.get('/:matrixId', (req, res) => {
    try {
        const { matrixId } = req.params;

        // 首先获取索引文件以找到矩阵文件的路径
        const indexPath = path.join(__dirname, '../../src/data/capability-matrices/matrix-index.json');
        const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

        // 查找指定矩阵的信息
        const matrixInfo = indexData.matrices.find(m => m.id === matrixId);

        if (!matrixInfo) {
            return res.status(404).json({ error: `Matrix with id ${matrixId} not found` });
        }

        // 获取矩阵文件内容
        const matrixPath = path.join(__dirname, '../../src/data/capability-matrices', matrixInfo.file);
        if (!fs.existsSync(matrixPath)) {
            return res.status(404).json({ error: `Matrix file for ${matrixId} not found` });
        }

        const matrixContent = fs.readFileSync(matrixPath, 'utf8');
        res.setHeader('Content-Type', 'text/markdown');
        res.send(matrixContent);
    } catch (error) {
        console.error(`Error fetching matrix content:`, error);
        res.status(500).json({ error: 'Failed to fetch matrix content' });
    }
});

module.exports = router; 