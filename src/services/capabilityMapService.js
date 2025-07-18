import architectureData from '../data/architecture-cards.json';

// 移除所有静态导入
// 保留动态导入的能力

// 前置声明，避免动态import的webpack警告
const importMap = {};

// 缓存对象
const manifestCache = {};
const capabilityMapCache = {};
const loadedSections = new Set();

/**
 * 获取正确的目录名称，兼容大小写差异
 * @param {string} sectionId - 区域ID
 * @returns {string} - 返回正确的目录名称
 */
const getCorrectDirectoryName = (sectionId) => {
    // 目录名称映射表，确保大小写正确
    const directoryMapping = {
        'coreai': 'coreAI',         // 注意大小写差异
        'coreaI': 'coreAI',
        'coreAi': 'coreAI',
        'CoreAI': 'coreAI',
        'admintouchpoints': 'admintouchpoints',
        'adminTouchPoints': 'admintouchpoints',
        'adminTouchpoints': 'admintouchpoints',
        'publictouchpoints': 'publictouchpoints',
        'publicTouchPoints': 'publictouchpoints',
        'publicTouchpoints': 'publictouchpoints',
        'servicelayer': 'servicelayer',
        'serviceLayer': 'servicelayer',
        'aiorchestrator': 'aiorchestrator',
        'aiOrchestrator': 'aiorchestrator',
        'AIOrchestrator': 'aiorchestrator',
        'thirdparty': 'thirdparty',
        'thirdParty': 'thirdparty',
        'dataanalysis': 'dataanalysis',
        'dataAnalysis': 'dataanalysis',
        'rag': 'rag',
        'RAG': 'rag',
        'Rag': 'rag',
        'model': 'model',
        'knowledge': 'knowledge'
    };

    return directoryMapping[sectionId] || sectionId;
};

// 添加工具函数来动态导入文件
/**
 * 动态导入JSON文件
 * @param {string} sectionId - 区域ID
 * @param {string} filename - 文件名
 * @returns {Promise<Object>} - 返回导入的数据
 */
export const importJsonFile = async (sectionId, filename) => {
    // 确保文件名有.json后缀
    const safeFileName = filename.endsWith('.json') ? filename : `${filename}.json`;

    try {
        // 获取正确的目录名称（处理大小写）
        const correctDirName = getCorrectDirectoryName(sectionId);

        // 构建完整路径
        const importPath = `../data/capabilitymaps/${correctDirName}/${safeFileName}`;
        console.log(`尝试导入: ${importPath} (原始ID: ${sectionId})`);

        try {
            // 使用webpack动态导入
            const module = await import(/* webpackChunkName: "[request]" */ `../data/capabilitymaps/${correctDirName}/${safeFileName}`);
            console.log(`动态导入成功: ${importPath}`);
            return module.default || module;
        } catch (importErr) {
            console.warn(`动态导入失败: ${importPath}`, importErr.message);

            // 尝试备选目录名称
            const alternativePaths = [
                `../data/capabilitymaps/${sectionId}/${safeFileName}`,
                `../data/capabilitymaps/${sectionId.toLowerCase()}/${safeFileName}`,
            ];

            // 如果是coreAI，尝试几种不同的大小写组合
            if (sectionId.toLowerCase() === 'coreai') {
                alternativePaths.push(
                    `../data/capabilitymaps/coreAI/${safeFileName}`,
                    `../data/capabilitymaps/CoreAI/${safeFileName}`,
                    `../data/capabilitymaps/coreai/${safeFileName}`
                );
            }

            // 尝试备选路径
            for (const path of alternativePaths) {
                try {
                    console.log(`尝试备选路径: ${path}`);
                    const module = await import(/* webpackChunkName: "[request]" */ path);
                    console.log(`备选路径导入成功: ${path}`);
                    return module.default || module;
                } catch (altErr) {
                    // 继续尝试下一个路径
                }
            }

            // 尝试使用webpack的require.context
            try {
                const context = require.context('../data/capabilitymaps', true, /\.json$/);

                // 尝试不同的键格式
                const possibleKeys = [
                    `./${correctDirName}/${safeFileName}`,
                    `./${sectionId}/${safeFileName}`,
                    `./${sectionId.toLowerCase()}/${safeFileName}`
                ];

                // 如果是coreAI，添加特殊处理
                if (sectionId.toLowerCase() === 'coreai') {
                    possibleKeys.push(
                        `./coreAI/${safeFileName}`,
                        `./CoreAI/${safeFileName}`,
                        `./coreai/${safeFileName}`
                    );
                }

                // 输出所有可用的键，帮助调试
                console.log('可用的context keys:', context.keys().filter(k => k.includes(safeFileName) ||
                    k.includes(correctDirName) ||
                    k.includes(sectionId) ||
                    k.includes(sectionId.toLowerCase())
                ));

                // 尝试所有可能的键
                for (const key of possibleKeys) {
                    if (context.keys().includes(key)) {
                        console.log(`通过context找到文件: ${key}`);
                        const module = context(key);
                        return module.default || module;
                    }
                }

                console.warn(`在context中未找到任何匹配的文件`);
            } catch (contextErr) {
                console.warn(`Context导入失败: ${contextErr.message}`);
            }

            // 最后尝试使用require，也考虑不同目录名
            try {
                const possiblePaths = [
                    `../data/capabilitymaps/${correctDirName}/${safeFileName}`,
                    `../data/capabilitymaps/${sectionId}/${safeFileName}`,
                    `../data/capabilitymaps/${sectionId.toLowerCase()}/${safeFileName}`
                ];

                // 如果是coreAI，添加特殊处理
                if (sectionId.toLowerCase() === 'coreai') {
                    possiblePaths.push(
                        `../data/capabilitymaps/coreAI/${safeFileName}`,
                        `../data/capabilitymaps/CoreAI/${safeFileName}`,
                        `../data/capabilitymaps/coreai/${safeFileName}`
                    );
                }

                for (const path of possiblePaths) {
                    try {
                        const module = require(path);
                        console.log(`通过require导入成功: ${path}`);
                        return module;
                    } catch (reqErr) {
                        // 继续尝试下一个路径
                    }
                }

                throw new Error(`所有require路径都失败`);
            } catch (requireErr) {
                console.warn(`所有require尝试均失败: ${requireErr.message}`);
            }

            throw new Error(`无法导入文件: ${sectionId}/${safeFileName}`);
        }
    } catch (error) {
        console.error(`导入JSON文件失败: ${sectionId}/${safeFileName}`, error);
        throw error;
    }
};

/**
 * 获取区域的manifest文件
 * @param {string} sectionId - 区域ID
 * @returns {Promise<Object>} - 返回manifest数据
 */
export const getSectionManifest = async (sectionId) => {
    // 转换为小写以标准化
    const normalizedSectionId = sectionId.toLowerCase();

    // 先检查缓存
    if (manifestCache[normalizedSectionId]) {
        return manifestCache[normalizedSectionId];
    }

    try {
        // 尝试动态加载
        const manifest = await importJsonFile(normalizedSectionId, 'manifest.json');
        if (manifest) {
            manifestCache[normalizedSectionId] = manifest;
            return manifest;
        }
    } catch (error) {
        console.error(`加载 ${normalizedSectionId} manifest失败`, error);
    }

    return null;
};

/**
 * 获取文件名对应的前缀
 * @param {string} sectionId - 区域ID
 * @param {Object} manifest - manifest对象 
 * @returns {string} - 返回文件名前缀
 */
const getFilePrefix = (sectionId, manifest) => {
    // 首先查看manifest是否定义了前缀
    if (manifest && manifest.prefix) {
        // 确保前缀有下划线后缀
        const prefix = manifest.prefix;
        return prefix.endsWith('_') ? prefix : `${prefix}_`;
    }

    // 各区域的默认前缀映射
    const prefixMap = {
        'admintouchpoints': 'at_',
        'publictouchpoints': 'pt_',
        'servicelayer': 'sl_',
        'coreai': 'cai_',
        'rag': 'rg_',
        'model': 'md_',
        'knowledge': 'kn_',
        'thirdparty': 'tp_',
        'dataanalysis': 'da_',
        'aiorchestrator': 'ao_'
    };

    return prefixMap[sectionId.toLowerCase()] || '';
};

/**
 * 获取完整的文件路径
 * @param {string} sectionId - 区域ID
 * @param {string} cardId - 卡片ID
 * @param {Object} manifest - manifest对象
 * @returns {string|null} - 返回完整路径或null
 */
const resolveCardPath = (sectionId, cardId, manifest) => {
    // 移除.json后缀以便标准化比较
    const normalizedCardId = cardId.replace('.json', '');

    console.log(`解析卡片路径: 区域=${sectionId}, 卡片ID=${normalizedCardId}`);

    // 情况1: 直接在manifest.cards中找到匹配的card
    if (manifest && Array.isArray(manifest.cards)) {
        // 首先检查完全匹配
        let card = manifest.cards.find(c =>
            c.id === normalizedCardId ||
            c.id === cardId ||
            (c.filename && c.filename.replace('.json', '') === normalizedCardId)
        );

        // 如果没找到，尝试提取数字部分进行匹配
        if (!card) {
            const numericPart = normalizedCardId.replace(/[^\d]/g, '');
            if (numericPart) {
                console.log(`尝试使用数字部分匹配: ${numericPart}`);
                card = manifest.cards.find(c => c.id === numericPart);
            }
        }

        if (card && card.filename) {
            console.log(`在manifest中找到匹配的卡片: ${card.filename}`);
            return card.filename;
        }
    }

    // 情况2: 在manifest.groups中的cards找到匹配的card
    if (manifest && Array.isArray(manifest.groups)) {
        for (const group of manifest.groups) {
            if (Array.isArray(group.cards)) {
                const card = group.cards.find(c =>
                    c.id === normalizedCardId ||
                    c.id === cardId ||
                    (c.filename && c.filename.replace('.json', '') === normalizedCardId)
                );

                if (card && card.filename) {
                    return card.filename;
                }
            }
        }
    }

    // 情况3: 尝试使用前缀和数字部分组合
    const prefix = getFilePrefix(sectionId, manifest);
    if (prefix) {
        // 尝试提取数字部分
        const numericPart = normalizedCardId.replace(/[^\d]/g, '');
        if (numericPart) {
            const simplifiedPath = `${prefix}${numericPart}.json`;
            console.log(`尝试简化路径: ${simplifiedPath}`);
            return simplifiedPath;
        }

        // 如果cardId已经包含前缀，直接返回
        if (normalizedCardId.startsWith(prefix)) {
            return `${normalizedCardId}.json`;
        }

        // 否则加上前缀
        return `${prefix}${normalizedCardId}.json`;
    }

    // 情况4: 尝试直接将cardId作为文件名
    return `${normalizedCardId}.json`;
};

/**
 * 预加载指定区域的所有能力地图
 * @param {string} sectionId - 区域ID
 * @returns {Promise<void>}
 */
export const preloadSectionMaps = async (sectionId) => {
    console.log(`开始预加载区域: ${sectionId}`);

    // 区域ID映射（旧ID -> 新ID）
    const sectionMapping = {
        'publicTouchPoints': 'publictouchpoints',
        'adminTouchPoints': 'admintouchpoints',
        'serviceLayer': 'servicelayer',
        'coreAI': 'coreAI',  // 保持正确的大小写
        'rag': 'rag',
        'model': 'model',
        'knowledge': 'knowledge',
        'thirdParty': 'thirdparty',
        'dataAnalysis': 'dataanalysis',
        'aiOrchestrator': 'aiorchestrator'
    };

    // 获取映射后的区域ID
    const effectiveSectionId = sectionMapping[sectionId] || sectionId;

    // 获取正确的目录名称
    const correctDirName = getCorrectDirectoryName(effectiveSectionId);

    // 如果已经加载过此区域，直接返回
    if (loadedSections.has(correctDirName.toLowerCase())) {
        console.log(`区域 ${correctDirName} 已加载过，跳过`);
        return;
    }

    try {
        // 加载区域的manifest
        const manifest = await getSectionManifest(correctDirName);
        if (!manifest) {
            console.error(`无法加载 ${correctDirName} 的manifest`);
            return;
        }

        console.log(`加载${correctDirName}区域的manifest成功`);

        // 获取文件前缀
        const prefix = getFilePrefix(correctDirName, manifest);
        console.log(`区域 ${correctDirName} 的文件前缀: ${prefix}`);

        // 初始化缓存
        if (!capabilityMapCache[correctDirName]) {
            capabilityMapCache[correctDirName] = {};
        }

        // 如果映射ID与原始ID不同，也初始化映射ID的缓存
        if (correctDirName !== sectionId && !capabilityMapCache[sectionId]) {
            capabilityMapCache[sectionId] = {};
        }

        // 如果有effectiveSectionId，也初始化
        if (effectiveSectionId !== correctDirName && !capabilityMapCache[effectiveSectionId]) {
            capabilityMapCache[effectiveSectionId] = {};
        }

        // 要加载的卡片集合
        const cardsToLoad = [];

        // 处理两种不同的manifest结构: groups或直接cards
        if (manifest.groups) {
            // 处理groups结构
            for (const group of manifest.groups) {
                if (Array.isArray(group.cards)) {
                    for (const card of group.cards) {
                        if (card.filename) {
                            cardsToLoad.push({
                                id: card.id,
                                filename: card.filename,
                                groupId: group.id.toLowerCase()
                            });
                        }
                    }
                }
            }
        } else if (Array.isArray(manifest.cards)) {
            // 处理直接cards结构
            for (const card of manifest.cards) {
                if (card.filename) {
                    cardsToLoad.push({
                        id: card.id,
                        filename: card.filename
                    });
                }
            }
        } else {
            console.warn(`manifest格式不符合预期：既没有groups也没有cards属性`);
        }

        // 加载所有卡片
        for (const card of cardsToLoad) {
            try {
                console.log(`尝试加载卡片: ${correctDirName}/${card.filename} (ID: ${card.id})`);
                const cardData = await importJsonFile(correctDirName, card.filename);

                // 使用不同的key缓存数据
                // 1. 使用文件名(不带扩展名)作为key
                const filenameKey = card.filename.split('/').pop().replace('.json', '');
                capabilityMapCache[correctDirName][filenameKey] = cardData;

                // 2. 使用卡片ID作为key
                capabilityMapCache[correctDirName][card.id] = cardData;

                // 3. 如果有group，使用group/id形式作为key
                if (card.groupId) {
                    capabilityMapCache[correctDirName][`${card.groupId}/${card.id}`] = cardData;
                }

                // 4. 将数据也缓存到映射的sectioId下
                if (correctDirName !== sectionId) {
                    capabilityMapCache[sectionId][filenameKey] = cardData;
                    capabilityMapCache[sectionId][card.id] = cardData;
                    if (card.groupId) {
                        capabilityMapCache[sectionId][`${card.groupId}/${card.id}`] = cardData;
                    }
                }

                // 5. 将数据也缓存到effectiveSectionId下（如果与correctDirName不同）
                if (effectiveSectionId !== correctDirName && effectiveSectionId !== sectionId) {
                    capabilityMapCache[effectiveSectionId][filenameKey] = cardData;
                    capabilityMapCache[effectiveSectionId][card.id] = cardData;
                    if (card.groupId) {
                        capabilityMapCache[effectiveSectionId][`${card.groupId}/${card.id}`] = cardData;
                    }
                }

                console.log(`成功加载卡片: ${correctDirName}/${card.filename}`);
            } catch (error) {
                console.warn(`加载卡片失败: ${correctDirName}/${card.filename}`, error.message);
            }
        }

        // 标记此区域已加载
        loadedSections.add(correctDirName.toLowerCase());
        if (sectionId !== correctDirName) {
            loadedSections.add(sectionId.toLowerCase());
        }
        if (effectiveSectionId !== correctDirName && effectiveSectionId !== sectionId) {
            loadedSections.add(effectiveSectionId.toLowerCase());
        }

        console.log(`区域预加载完成: ${correctDirName}, 共加载 ${cardsToLoad.length} 个卡片`);
        console.log(`区域 ${correctDirName} 的缓存状态:`, {
            loadedSections: Array.from(loadedSections),
            availableKeys: capabilityMapCache[correctDirName] ? Object.keys(capabilityMapCache[correctDirName]) : []
        });
    } catch (error) {
        console.error(`预加载区域失败: ${correctDirName}`, error);
    }
};

/**
 * 获取能力地图数据
 * @param {string} sectionId - 区域ID
 * @param {string} cardId - 卡片ID
 * @returns {Promise<Object>} - 返回卡片数据
 */
export const getCapabilityMap = async (sectionId, cardId) => {
    console.log(`获取能力地图: ${sectionId}/${cardId}`);

    // 添加更详细的调试日志
    console.log(`当前缓存状态:`, {
        loadedSections: Array.from(loadedSections),
        hasSectionCache: Object.keys(capabilityMapCache).includes(sectionId) ? '是' : '否',
        cacheSections: Object.keys(capabilityMapCache),
    });

    // 区域ID映射（旧ID -> 新ID）
    const sectionMapping = {
        'publicTouchPoints': 'publictouchpoints',
        'adminTouchPoints': 'admintouchpoints',
        'serviceLayer': 'servicelayer',
        'coreAI': 'coreAI',  // 保持正确的大小写
        'rag': 'rag',
        'model': 'model',
        'knowledge': 'knowledge',
        'thirdParty': 'thirdparty',
        'dataAnalysis': 'dataanalysis',
        'aiOrchestrator': 'aiorchestrator'
    };

    // 获取映射后的区域ID
    const effectiveSectionId = sectionMapping[sectionId] || sectionId;

    // 获取正确的目录名称
    const correctDirName = getCorrectDirectoryName(effectiveSectionId);

    // 尝试规范化ID (移除.json后缀)
    const normalizedCardId = cardId.replace('.json', '');

    // 检查缓存 - 尝试各种可能的键和区域ID
    // 1. 检查correctDirName的缓存
    if (capabilityMapCache[correctDirName] && capabilityMapCache[correctDirName][normalizedCardId]) {
        console.log(`从缓存获取(正确目录): ${correctDirName}/${normalizedCardId}`);
        return capabilityMapCache[correctDirName][normalizedCardId];
    }

    // 2. 检查原始sectionId的缓存
    if (capabilityMapCache[sectionId] && capabilityMapCache[sectionId][normalizedCardId]) {
        console.log(`从缓存获取(原始ID): ${sectionId}/${normalizedCardId}`);
        return capabilityMapCache[sectionId][normalizedCardId];
    }

    // 3. 检查effectiveSectionId的缓存
    if (
        effectiveSectionId !== correctDirName &&
        effectiveSectionId !== sectionId &&
        capabilityMapCache[effectiveSectionId] &&
        capabilityMapCache[effectiveSectionId][normalizedCardId]
    ) {
        console.log(`从缓存获取(映射ID): ${effectiveSectionId}/${normalizedCardId}`);
        return capabilityMapCache[effectiveSectionId][normalizedCardId];
    }

    // 4. 尝试使用带前缀的ID
    const manifest = manifestCache[correctDirName];
    const prefix = getFilePrefix(correctDirName, manifest);

    if (prefix && !normalizedCardId.startsWith(prefix)) {
        const prefixedId = `${prefix}${normalizedCardId}`;

        // 检查在所有可能的区域ID下是否有带前缀的缓存
        if (capabilityMapCache[correctDirName] && capabilityMapCache[correctDirName][prefixedId]) {
            console.log(`从缓存获取(前缀键): ${correctDirName}/${prefixedId}`);
            return capabilityMapCache[correctDirName][prefixedId];
        }

        if (capabilityMapCache[sectionId] && capabilityMapCache[sectionId][prefixedId]) {
            console.log(`从缓存获取(前缀键+原始ID): ${sectionId}/${prefixedId}`);
            return capabilityMapCache[sectionId][prefixedId];
        }

        if (
            effectiveSectionId !== correctDirName &&
            effectiveSectionId !== sectionId &&
            capabilityMapCache[effectiveSectionId] &&
            capabilityMapCache[effectiveSectionId][prefixedId]
        ) {
            console.log(`从缓存获取(前缀键+映射ID): ${effectiveSectionId}/${prefixedId}`);
            return capabilityMapCache[effectiveSectionId][prefixedId];
        }
    }

    // 确保区域已预加载
    if (!loadedSections.has(correctDirName.toLowerCase())) {
        console.log(`区域 ${correctDirName} 未预加载，正在加载...`);
        await preloadSectionMaps(correctDirName);

        // 尝试使用数字部分作为key进行缓存检查
        const numericPart = normalizedCardId.replace(/[^\d]/g, '');
        if (numericPart && capabilityMapCache[correctDirName]) {
            // 检查是否有前缀+数字的格式
            const prefix = getFilePrefix(correctDirName, manifestCache[correctDirName]);
            if (prefix) {
                const simplifiedKey = `${prefix}${numericPart}`;
                if (capabilityMapCache[correctDirName][simplifiedKey]) {
                    console.log(`使用简化键从缓存获取: ${correctDirName}/${simplifiedKey}`);
                    return capabilityMapCache[correctDirName][simplifiedKey];
                }
            }

            // 直接检查数字部分
            if (capabilityMapCache[correctDirName][numericPart]) {
                console.log(`使用数字ID从缓存获取: ${correctDirName}/${numericPart}`);
                return capabilityMapCache[correctDirName][numericPart];
            }
        }

        // 预加载后再次检查缓存
        // 检查所有可能的缓存位置
        if (capabilityMapCache[correctDirName] && capabilityMapCache[correctDirName][normalizedCardId]) {
            console.log(`预加载后从缓存获取: ${correctDirName}/${normalizedCardId}`);
            return capabilityMapCache[correctDirName][normalizedCardId];
        }

        // 检查带前缀的ID
        if (prefix && !normalizedCardId.startsWith(prefix)) {
            const prefixedId = `${prefix}${normalizedCardId}`;
            if (capabilityMapCache[correctDirName] && capabilityMapCache[correctDirName][prefixedId]) {
                console.log(`预加载后从缓存获取(前缀): ${correctDirName}/${prefixedId}`);
                return capabilityMapCache[correctDirName][prefixedId];
            }
        }
    } else {
        // 区域已预加载，尝试使用数字部分作为key
        const numericPart = normalizedCardId.replace(/[^\d]/g, '');
        if (numericPart && capabilityMapCache[correctDirName]) {
            // 检查是否有前缀+数字的格式
            const prefix = getFilePrefix(correctDirName, manifestCache[correctDirName]);
            if (prefix) {
                const simplifiedKey = `${prefix}${numericPart}`;
                if (capabilityMapCache[correctDirName][simplifiedKey]) {
                    console.log(`使用简化键从缓存获取: ${correctDirName}/${simplifiedKey}`);
                    return capabilityMapCache[correctDirName][simplifiedKey];
                }
            }

            // 直接检查数字部分
            if (capabilityMapCache[correctDirName][numericPart]) {
                console.log(`使用数字ID从缓存获取: ${correctDirName}/${numericPart}`);
                return capabilityMapCache[correctDirName][numericPart];
            }
        }
    }

    // 如果预加载后仍然没有找到，尝试单独加载这个卡片
    try {
        // 再次获取manifest以防上面的操作中已经加载了
        let manifest = manifestCache[correctDirName];
        if (!manifest) {
            manifest = await getSectionManifest(correctDirName);
        }

        if (!manifest) {
            console.error(`找不到 ${correctDirName} 的manifest`);
            return null;
        }

        // 解析文件路径
        const cardPath = resolveCardPath(correctDirName, normalizedCardId, manifest);
        if (!cardPath) {
            console.error(`无法解析 ${correctDirName}/${normalizedCardId} 的文件路径`);
            return null;
        }

        console.log(`尝试单独加载卡片: ${correctDirName}/${cardPath}`);
        const cardData = await importJsonFile(correctDirName, cardPath);

        // 缓存数据到所有可能的位置
        // 初始化缓存对象（如果需要）
        if (!capabilityMapCache[correctDirName]) {
            capabilityMapCache[correctDirName] = {};
        }
        if (sectionId !== correctDirName && !capabilityMapCache[sectionId]) {
            capabilityMapCache[sectionId] = {};
        }
        if (
            effectiveSectionId !== correctDirName &&
            effectiveSectionId !== sectionId &&
            !capabilityMapCache[effectiveSectionId]
        ) {
            capabilityMapCache[effectiveSectionId] = {};
        }

        // 使用多种key缓存
        const filenameKey = cardPath.split('/').pop().replace('.json', '');

        // 缓存到correctDirName下
        capabilityMapCache[correctDirName][filenameKey] = cardData;
        capabilityMapCache[correctDirName][normalizedCardId] = cardData;

        // 缓存到原始sectionId下
        if (sectionId !== correctDirName) {
            capabilityMapCache[sectionId][filenameKey] = cardData;
            capabilityMapCache[sectionId][normalizedCardId] = cardData;
        }

        // 缓存到effectiveSectionId下
        if (effectiveSectionId !== correctDirName && effectiveSectionId !== sectionId) {
            capabilityMapCache[effectiveSectionId][filenameKey] = cardData;
            capabilityMapCache[effectiveSectionId][normalizedCardId] = cardData;
        }

        console.log(`成功加载单个卡片: ${correctDirName}/${cardPath}`);
        return cardData;
    } catch (error) {
        console.error(`获取能力地图数据失败: ${correctDirName}/${normalizedCardId}`, error);
    }

    return null;
};

/**
 * 初始化能力地图服务
 */
export const initCapabilityMapService = async () => {
    // 预加载所有区域（除了aiorchestrator）
    const sections = [
        'admintouchpoints',
        'servicelayer',
        'publictouchpoints',
        'coreAI',  // 修正大小写为正确格式
        'rag',
        'model',
        'knowledge',
        'thirdparty',
        'dataanalysis'
    ];

    console.log('开始初始化能力地图服务...');

    for (const section of sections) {
        await preloadSectionMaps(section);
    }

    console.log('完成所有区域的预加载');
    console.log('已加载的区域:', Array.from(loadedSections));
    console.log('缓存的区域:', Object.keys(capabilityMapCache));
};

/**
 * 为兼容旧代码添加的初始化方法
 */
const initCapabilityMaps = () => {
    console.log('调用旧版初始化方法，已自动替换为新版初始化');
    // 不需要做任何操作，因为在导入时已经自动初始化
};

// 自动初始化
initCapabilityMapService().catch(error => {
    console.error('能力地图服务初始化失败', error);
});

// 导出架构数据 (原始功能保留)
export const getArchitectureData = () => {
    return architectureData;
};

// 创建服务对象
const capabilityMapService = {
    getArchitectureData,
    getCapabilityMap,
    getSectionManifest,
    importJsonFile,
    initCapabilityMapService,
    preloadSectionMaps,
    initCapabilityMaps // 兼容旧代码
};

// 导出默认对象
export default capabilityMapService;