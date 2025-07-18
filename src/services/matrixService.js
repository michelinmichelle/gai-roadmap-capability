/**
 * 能力矩阵服务 - 负责加载和解析能力矩阵Markdown文件
 */

// 本地测试用的mock数据
const MOCK_DATA = {
    matrixIndex: {
        "version": "1.0",
        "matrices": [
            {
                "id": "agent-capabilities",
                "title": {
                    "en": "Agent Capabilities Matrix",
                    "zh": "Agent基础能力矩阵"
                },
                "description": {
                    "en": "Overview of different agent capabilities across various dimensions",
                    "zh": "不同类型Agent在各种能力维度上的概览"
                },
                "file": "agent-capabilities.md",
                "subMatrices": [
                    "planning-capabilities",
                    "memory-capabilities",
                    "tool-capabilities"
                ]
            },
            {
                "id": "planning-capabilities",
                "title": {
                    "en": "Planning Capabilities Matrix",
                    "zh": "规划能力细分矩阵"
                },
                "description": {
                    "en": "Detailed breakdown of planning capabilities for AI agents",
                    "zh": "AI智能体规划能力的详细分解"
                },
                "file": "planning-capabilities.md",
                "parentMatrix": "agent-capabilities"
            },
            {
                "id": "memory-capabilities",
                "title": {
                    "en": "Memory Capabilities Matrix",
                    "zh": "记忆能力细分矩阵"
                },
                "description": {
                    "en": "Detailed breakdown of memory capabilities for AI agents",
                    "zh": "AI智能体记忆能力的详细分解"
                },
                "file": "memory-capabilities.md",
                "parentMatrix": "agent-capabilities"
            },
            {
                "id": "tool-capabilities",
                "title": {
                    "en": "Tool Use Capabilities Matrix",
                    "zh": "工具调用能力细分矩阵"
                },
                "description": {
                    "en": "Detailed breakdown of tool use capabilities for AI agents",
                    "zh": "AI智能体工具调用能力的详细分解"
                },
                "file": "tool-capabilities.md",
                "parentMatrix": "agent-capabilities"
            },
            {
                "id": "knowledge-processing",
                "title": {
                    "en": "Knowledge Preprocessing Matrix",
                    "zh": "知识预处理矩阵"
                },
                "description": {
                    "en": "Capabilities for preprocessing different types of documents and media",
                    "zh": "不同类型文档和媒体的预处理能力"
                },
                "file": "knowledge-preprocessing.md"
            },
            {
                "id": "rag-capabilities",
                "title": {
                    "en": "RAG Capabilities Matrix",
                    "zh": "RAG细分能力矩阵"
                },
                "description": {
                    "en": "Detailed breakdown of Retrieval Augmented Generation capabilities",
                    "zh": "检索增强生成技术的详细能力分解"
                },
                "file": "rag-capabilities.md"
            }
        ],
        "statusTypes": [
            {
                "id": "ready",
                "symbol": "✅",
                "label": {
                    "en": "Ready",
                    "zh": "已就绪"
                },
                "color": "#10b981"
            },
            {
                "id": "partial",
                "symbol": "⚠️",
                "label": {
                    "en": "Partially Ready",
                    "zh": "部分就绪"
                },
                "color": "#f59e0b"
            },
            {
                "id": "missing",
                "symbol": "❌",
                "label": {
                    "en": "Missing",
                    "zh": "未就绪"
                },
                "color": "#ef4444"
            }
        ]
    },
    matrixContents: {
        "agent-capabilities": `# Agent基础能力矩阵
# Agent Capabilities Matrix

| Agent能力<br>Agent Capability | 规划能力<br>Planning | 记忆能力<br>Memory | 工具调用能力<br>Tool Use | 学习能力<br>Learning | 协作能力<br>Collaboration | 自我监控<br>Self-Monitoring |
|---------|---------|---------|------------|---------|---------|---------|
| 代理类型<br>Agent Type | ⚠️ | ⚠️ | ✅ | ❌ | ❌ | ❌ |
| 单体Agent<br>Single Agent | ⚠️ | ⚠️ | ✅ | ❌ | ❌ | ❌ |
| 多Agent系统<br>Multi-Agent System | ❌| ❌| ❌| ❌ | ❌ | ❌ |
| 专家Agent<br>Expert Agent | ❌| ❌ | ❌ | ❌ | ❌ | ❌ |
| 通用Agent<br>General Agent | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |`,

        "planning-capabilities": `# 规划能力 (Planning) 细分矩阵
# Planning Capability Matrix

| 规划能力<br>Planning Capability | 任务分解<br>Task Decomposition | 步骤排序<br>Step Sequencing | 条件分支<br>Conditional Branching | 目标管理<br>Goal Management | 错误处理<br>Error Handling | 资源优化<br>Resource Optimization |
|---------|---------|---------|---------|---------|---------|---------|
| 单步规划<br>Single-Step Planning | ✅ | ✅ | ✅ | ✅ | ✅  | ❌ |
| 多步规划<br>Multi-Step Planning | ✅ | ✅ | ⚠️ | ❌ | ⚠️ | ❌ |
| 层次规划<br>Hierarchical Planning | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 动态规划<br>Dynamic Planning | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 重规划能力<br>Replanning | ❌ | ❌ |❌ | ❌ | ❌ | ❌ |
| 追踪执行<br>Execution Tracking | ❌| ❌| ❌ | ❌| ❌| ❌|`,

        "memory-capabilities": `# 记忆能力 (Memory) 细分矩阵
# Memory Capability Matrix

| 记忆能力<br>Memory Capability | 有限上下文问答场景<br>Limited Context Q&A | 高连贯对话场景<br>High-Coherence Dialogue | 复杂推理需求场景<br>Complex Reasoning | 长期个性化服务<br>Long-term Personalization | 多模态交互<br>Multi-Modal Interaction |
|---------|---------|---------|-----------|---------|---------|
| 会话记忆<br>Session Memory | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| 向量记忆<br>Vector Memory | ✅ | ✅ | ⚠️ | ❌| ❌ |
| 结构化记忆<br>Structured Memory | ❌ | ❌ | ❌ | ❌ | ❌ |
| 衰减记忆<br>Decaying Memory | ❌ | ❌ | ❌ | ❌ | ❌ |
| 多模态记忆<br>Multi-Modal Memory | ❌ | ❌ | ❌ | ❌ | ❌ |
| 跨会话记忆<br>Cross-Session Memory | ❌ | ❌ | ❌ | ❌ | ❌ |`,

        "tool-capabilities": `# 工具调用能力 (Tool Use) 细分矩阵
# Tool Use Capability Matrix

| 工具调用能力<br>Tool Use | 工具选择<br>Tool Selection | 参数构造<br>Parameter Construction | 结果处理<br>Result Processing | 错误恢复<br>Error Recovery | 工具组合<br>Tool Combination | 工具学习<br>Tool Learning |
|------------|---------|---------|---------|---------|---------|---------|
| 文件操作<br>File Operations | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ❌ |
| 内部知识检索<br>Internal Knowledge Retrieval | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ❌ |
| 外部知识检索<br>External Knowledge Retrieval | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| API调用<br>API Calls | ⚠️| ✅ | ✅ | ⚠️ | ⚠️ | ❌ |
| 数据查询工具<br>Data Query Tools | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 数据可视化<br>Data Visualization | ❌ | ❌ | ❌| ❌ | ❌ | ❌ |`,

        "knowledge-processing": `# 知识预处理矩阵
# Knowledge Preprocessing Matrix

| 能力分类<br>Capability Category | 文本类<br>Text | PDF<br>PDF | Word<br>Word | Excel<br>Excel | PPT<br>PPT | 网页类<br>Web | 图片<br>Image | 音频<br>Audio | 视频<br>Video |
|---------|-----|-----|------|-------|-----|-----|------|------|------|
| 文本提取<br>Text Extraction | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| 图片处理<br>Image Processing | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 结构化数据<br>Structured Data | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 格式保留<br>Format Preservation | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅  | ❌ | ✅  |
| 布局分析<br>Layout Analysis | ✅ | ❌ | ❌ | ❌  | ❌ | ❌ | ❌ | ❌ | ❌ | 
| 元数据提取<br>Metadata Extraction | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| 内容检索<br>Content Retrieval | ✅ | ✅ | ✅ | ✅ | ✅ | ❌  | ✅ | ❌ | ✅  |
| 语义理解<br>Semantic Understanding | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| 版本兼容<br>Version Compatibility | ❌ |❌| ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 分块处理<br>Chunking | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| 向量存储<br>Vector Storage | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |`,

        "rag-capabilities": `# RAG细分能力矩阵
# RAG Capability Matrix

| RAG能力项<br>RAG Capability | 内部简单知识检索<br>Internal Simple Knowledge Retrieval | 内部专业知识深度检索<br>Internal Deep Expert Knowledge Retrieval | 外部知识整合<br>External Knowledge Integration |
|----------------------|------------------------------------------------|---------------------------------------------------|---------------------------------------------|
| 基础语义检索（稠密）<br>Dense Semantic Retrieval | ✅ | ✅ | ⚠️ |
| 全文检索（稀疏）<br>Sparse Keyword Retrieval | ✅ | ⚠️ | ⚠️ |
| 混合检索<br>Hybrid Retrieval | ✅ | ✅ | ✅ |
| 多重过滤检索<br>Multi-filter Retrieval | ⚠️ | ✅ | ⚠️ |
| 重排（Reranking） | ⚠️ | ✅ | ✅ |
| 简单意图路由<br>Simple Intent Routing | ✅ | ⚠️ | ❌ |
| 复杂意图分解<br>Complex Intent Decomposition | ⚠️ | ✅ | ✅ |`,
    }
};

// 是否使用mock数据（生产环境应设为false）
const USE_MOCK = true;

/**
 * 获取矩阵索引
 * @returns {Promise<Object>} 矩阵索引数据
 */
export const getMatrixIndex = async () => {
    // 使用mock数据进行开发测试
    if (USE_MOCK) {
        console.log('Using mock matrix index data');
        return MOCK_DATA.matrixIndex;
    }

    try {
        console.log('Fetching matrix index...');
        const response = await fetch('/api/matrices/index');
        if (!response.ok) {
            console.error('Matrix index response not OK:', response.status, response.statusText);
            throw new Error('Failed to fetch matrix index');
        }
        const data = await response.json();
        console.log('Matrix index fetched successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching matrix index:', error);
        throw error;
    }
};

/**
 * 获取指定矩阵的Markdown内容
 * @param {string} matrixId 矩阵ID
 * @returns {Promise<string>} Markdown内容
 */
export const getMatrixContent = async (matrixId) => {
    // 使用mock数据进行开发测试
    if (USE_MOCK) {
        console.log(`Using mock matrix content for ${matrixId}`);
        return MOCK_DATA.matrixContents[matrixId] || '# 没有找到矩阵数据';
    }

    try {
        console.log(`Fetching matrix content for ${matrixId}...`);
        const response = await fetch(`/api/matrices/${matrixId}`);
        if (!response.ok) {
            console.error(`Matrix content response not OK for ${matrixId}:`, response.status, response.statusText);
            throw new Error(`Failed to fetch matrix content for ${matrixId}`);
        }
        const data = await response.text();
        console.log(`Matrix content for ${matrixId} fetched successfully, length:`, data.length);
        return data;
    } catch (error) {
        console.error(`Error fetching matrix content for ${matrixId}:`, error);
        throw error;
    }
};

/**
 * 解析Markdown格式的能力矩阵
 * @param {string} markdown Markdown格式的矩阵内容
 * @param {string} lang 语言代码 ('en'|'zh')
 * @returns {Object} 解析后的矩阵数据
 */
export const parseMatrixMarkdown = (markdown, lang = 'zh') => {
    // 分割Markdown内容为行
    const lines = markdown.split('\n');

    // 提取标题
    const titleLine = lines.find(line => line.startsWith('# '));
    const title = titleLine ? titleLine.replace('# ', '').trim() : '';

    // 找到表格开始的位置
    const tableStartIndex = lines.findIndex(line => line.includes('|') && line.includes('---'));
    if (tableStartIndex === -1) {
        return { title, headers: [], rows: [] };
    }

    // 提取表头行
    const headerLine = lines[tableStartIndex - 1];
    // 解析表头，处理中英文
    const headers = headerLine.split('|')
        .filter(cell => cell.trim() !== '')
        .map(cell => {
            const parts = cell.split('<br>');
            return {
                zh: parts[0].trim(),
                en: parts.length > 1 ? parts[1].trim() : parts[0].trim()
            };
        });

    // 提取表格正文行
    const rows = [];
    for (let i = tableStartIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || !line.includes('|')) continue;

        const cells = line.split('|')
            .filter(cell => cell.trim() !== '')
            .map(cell => cell.trim());

        if (cells.length === 0) continue;

        // 解析行首单元格（行标题）
        const rowHeader = cells[0];
        const rowHeaderParts = rowHeader.split('<br>');
        const rowTitle = {
            zh: rowHeaderParts[0].trim(),
            en: rowHeaderParts.length > 1 ? rowHeaderParts[1].trim() : rowHeaderParts[0].trim()
        };

        // 解析状态单元格
        const statuses = cells.slice(1).map(cell => cell.trim());

        rows.push({
            title: rowTitle,
            statuses
        });
    }

    return {
        title,
        headers: headers.map(h => h[lang] || h.zh || h.en),
        rows: rows.map(row => ({
            title: row.title[lang] || row.title.zh || row.title.en,
            statuses: row.statuses
        }))
    };
};

/**
 * 获取并解析一个矩阵
 * @param {string} matrixId 矩阵ID
 * @param {string} lang 语言代码 ('en'|'zh')
 * @returns {Promise<Object>} 解析后的矩阵数据
 */
export const getMatrix = async (matrixId, lang = 'zh') => {
    const markdown = await getMatrixContent(matrixId);
    return parseMatrixMarkdown(markdown, lang);
};

/**
 * 获取完整的矩阵层级结构
 * @param {string} lang 语言代码 ('en'|'zh')
 * @returns {Promise<Object>} 完整的矩阵层级结构
 */
export const getMatrixHierarchy = async (lang = 'zh') => {
    const index = await getMatrixIndex();

    // 处理主矩阵及其子矩阵
    const processMatrix = async (matrixId) => {
        const matrixInfo = index.matrices.find(m => m.id === matrixId);
        if (!matrixInfo) return null;

        const matrix = await getMatrix(matrixId, lang);

        // 如果有子矩阵，递归处理
        const children = [];
        if (matrixInfo.subMatrices && matrixInfo.subMatrices.length > 0) {
            for (const subMatrixId of matrixInfo.subMatrices) {
                const subMatrix = await processMatrix(subMatrixId);
                if (subMatrix) {
                    children.push(subMatrix);
                }
            }
        }

        return {
            id: matrixId,
            title: matrixInfo.title[lang] || matrixInfo.title.zh || matrixInfo.title.en,
            description: matrixInfo.description[lang] || matrixInfo.description.zh || matrixInfo.description.en,
            matrix,
            children
        };
    };

    // 找到顶级矩阵（没有parentMatrix的）
    const rootMatrices = index.matrices.filter(m => !m.parentMatrix);

    // 处理每个顶级矩阵
    const hierarchy = [];
    for (const rootMatrix of rootMatrices) {
        const processedMatrix = await processMatrix(rootMatrix.id);
        if (processedMatrix) {
            hierarchy.push(processedMatrix);
        }
    }

    return {
        statusTypes: index.statusTypes,
        matrices: hierarchy
    };
}; 