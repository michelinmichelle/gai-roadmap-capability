const fs = require('fs');
const path = require('path');

// 定义优先级等级
const PRIORITY_LEVELS = {
    0: { label: { en: 'Normal', zh: '普通' }, color: '#ffffff' },
    1: { label: { en: 'High', zh: '高' }, color: '#fef2f2' },
    2: { label: { en: 'Critical', zh: '关键' }, color: '#fee2e2' },
    3: { label: { en: 'Low', zh: '低' }, color: '#f3f4f6' }
};

// 定义状态
const STATUS = {
    ready: { label: { en: 'Ready', zh: '就绪' }, color: '#22c55e' },
    sketch: { label: { en: 'Sketch', zh: '草稿' }, color: '#fef9c3' },
    missing: { label: { en: 'Missing', zh: '缺失' }, color: '#f3f4f6' },
    needEnhancement: { label: { en: 'Need Enhancement', zh: '需要增强' }, color: '#fef08a' },
    constraint: { label: { en: 'Constraint', zh: '约束' }, color: '#fee2e2' }
};

function analyzeCapabilities(filePath) {
    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const stats = {
            readyButEnhancement: 0,
            criticalMissing: 0,
            total: 0
        };

        if (!content.capabilities || !Array.isArray(content.capabilities)) {
            console.warn(`No capabilities array found in ${filePath}`);
            return null;
        }

        content.capabilities.forEach(cap => {
            if (!cap) return;

            // 检查是否是需要增强的能力
            if (cap.status === 'needEnhancement' || cap.needEnhancement === true) {
                stats.readyButEnhancement++;
            }

            // 检查是否是关键缺失的能力
            if (cap.status === 'missing' && cap.priority?.level === 2) {
                stats.criticalMissing++;
            }

            stats.total++;
        });

        return {
            title: content.metadata?.title || 'Unknown',
            ref: content.ref || path.basename(filePath, '.json'),
            stats: stats
        };
    } catch (error) {
        console.error(`Error analyzing file ${filePath}:`, error);
        return null;
    }
}

function getDirectoryInfo(dirPath) {
    try {
        const manifestPath = path.join(dirPath, 'manifest.json');
        if (fs.existsSync(manifestPath)) {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            return {
                prefix: manifest.prefix || '',
                ref: manifest.ref || path.basename(dirPath),
                cards: manifest.cards || []
            };
        }
    } catch (error) {
        console.error(`Error reading manifest in ${dirPath}:`, error);
    }
    return null;
}

function generateStats() {
    const capabilityMapsDir = path.join(__dirname, '..', 'data', 'capabilitymaps');
    console.log('Looking for capability maps in:', capabilityMapsDir);

    const stats = {
        total: {
            readyButEnhancement: 0,
            criticalMissing: 0,
            total: 0
        },
        byCategory: {}
    };

    try {
        // 遍历所有目录
        fs.readdirSync(capabilityMapsDir).forEach(dir => {
            const dirPath = path.join(capabilityMapsDir, dir);
            if (fs.statSync(dirPath).isDirectory()) {
                console.log('Processing directory:', dir);

                const dirInfo = getDirectoryInfo(dirPath);
                if (!dirInfo) {
                    console.warn(`No manifest found in ${dir}`);
                    return;
                }

                const categoryRef = dirInfo.ref;
                stats.byCategory[categoryRef] = {
                    total: {
                        readyButEnhancement: 0,
                        criticalMissing: 0,
                        total: 0
                    },
                    cards: []
                };

                // 使用manifest.json中的卡片信息
                if (dirInfo.cards) {
                    dirInfo.cards.forEach(card => {
                        if (!card || !card.filename) {
                            console.warn('Invalid card in manifest:', card);
                            return;
                        }

                        const filePath = path.join(dirPath, card.filename);
                        if (fs.existsSync(filePath)) {
                            console.log('Processing file from manifest:', card.filename);
                            const analysis = analyzeCapabilities(filePath);
                            if (analysis) {
                                analysis.ref = card.ref;
                                stats.byCategory[categoryRef].cards.push(analysis);

                                // 更新分类统计
                                stats.byCategory[categoryRef].total.readyButEnhancement += analysis.stats.readyButEnhancement;
                                stats.byCategory[categoryRef].total.criticalMissing += analysis.stats.criticalMissing;
                                stats.byCategory[categoryRef].total.total += analysis.stats.total;

                                // 更新总体统计
                                stats.total.readyButEnhancement += analysis.stats.readyButEnhancement;
                                stats.total.criticalMissing += analysis.stats.criticalMissing;
                                stats.total.total += analysis.stats.total;
                            }
                        } else {
                            console.warn('File not found:', filePath);
                        }
                    });
                }
            }
        });

        // 生成统计报告
        const report = {
            generatedAt: new Date().toISOString(),
            stats: stats,
            summary: {
                total: stats.total.total,
                readyButEnhancement: stats.total.readyButEnhancement,
                criticalMissing: stats.total.criticalMissing
            }
        };

        // 写入统计结果
        const outputPath = path.join(__dirname, '..', 'data', 'capabilityStats.json');
        fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
        console.log('Writing stats to:', outputPath);

        // 打印摘要
        console.log('\n=== 能力统计摘要 ===');
        console.log(`总能力数: ${stats.total.total}`);
        console.log(`Ready但需要增强: ${stats.total.readyButEnhancement}`);
        console.log(`关键缺失: ${stats.total.criticalMissing}`);

        console.log('\n=== 分类统计 ===\n');
        Object.entries(stats.byCategory).forEach(([category, data]) => {
            console.log(`${category}:`);
            console.log(`  总能力数: ${data.total.total}`);
            console.log(`  Ready但需要增强: ${data.total.readyButEnhancement}`);
            console.log(`  关键缺失: ${data.total.criticalMissing}\n`);
        });

        console.log('Statistics generation completed successfully.');
        return report;
    } catch (error) {
        console.error('Error generating stats:', error);
        return null;
    }
}

// 执行统计
try {
    generateStats();
} catch (error) {
    console.error('Failed to generate statistics:', error);
    process.exit(1);
} 