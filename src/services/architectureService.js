import architectureData from '../data/architecture-cards.json';

// 将数据转换为组件状态格式
export const convertDataToComponents = (data) => {
    const components = {};

    Object.entries(data.sections).forEach(([sectionNumber, section]) => {
        // 确保 cards 数组存在
        if (!Array.isArray(section.cards)) {
            section.cards = [];
        }

        // 处理主要组件
        components[section.id] = section.cards.map(card => {
            // 为AI编排器的卡片添加分组信息
            if (section.id === 'aiOrchestrator') {
                let groupId;
                let groupTitle;

                // 根据卡片ID确定分组
                if (card.id.startsWith('singleAgent') || card.content.en.startsWith('Single-Agent')) {
                    groupId = 'singleAgent';
                    groupTitle = {
                        en: 'Single-Agent Orchestration',
                        zh: '单 Agent 编排'
                    };
                } else if (card.id.startsWith('multiAgent') || card.content.en.startsWith('Multi-Agent')) {
                    groupId = 'multiAgent';
                    groupTitle = {
                        en: 'Multi-Agent Orchestration',
                        zh: '多 Agent 编排'
                    };
                } else if (card.id.startsWith('hitl') || card.content.en.startsWith('HITL')) {
                    groupId = 'hitl';
                    groupTitle = {
                        en: 'Human-in-the-Loop Orchestration',
                        zh: 'HITL 编排'
                    };
                }

                const baseCard = {
                    ...card,
                    displayContent: {
                        en: `${sectionNumber}.${card.index} ${card.content.en}`,
                        zh: `${sectionNumber}.${card.index} ${card.content.zh}`
                    },
                    content: card.content,
                    group: groupId ? {
                        id: groupId,
                        title: groupTitle,
                        color: 'transparent'
                    } : card.group
                };

                // 处理capabilityMap或capabilityMapRef属性
                if (card.capabilityMapRef) {
                    baseCard.capabilityMapRef = card.capabilityMapRef;
                    // 删除可能存在的capabilityMap，防止同时存在两者
                    delete baseCard.capabilityMap;
                } else if (card.capabilityMap) {
                    baseCard.capabilityMap = card.capabilityMap;
                }

                return baseCard;
            }
            // 为Core AI的卡片添加分组信息
            else if (section.id === 'coreAI') {
                let groupId;
                let groupTitle;

                // 根据卡片ID或内容确定分组
                if (card.group?.id === 'useCase' || card.content.en.toLowerCase().includes('use case')) {
                    groupId = 'useCase';
                    groupTitle = {
                        en: 'Use Cases',
                        zh: '场景用例'
                    };
                } else if (card.group?.id === 'component' || card.content.en.toLowerCase().includes('component')) {
                    groupId = 'component';
                    groupTitle = {
                        en: 'Components',
                        zh: '组件'
                    };
                }

                const baseCard = {
                    ...card,
                    displayContent: {
                        en: `${sectionNumber}.${card.index} ${card.content.en}`,
                        zh: `${sectionNumber}.${card.index} ${card.content.zh}`
                    },
                    content: card.content,
                    group: {
                        id: groupId || 'useCase',
                        title: groupTitle || {
                            en: 'Use Cases',
                            zh: '场景用例'
                        }
                    }
                };

                // 处理capabilityMap或capabilityMapRef属性
                if (card.capabilityMapRef) {
                    baseCard.capabilityMapRef = card.capabilityMapRef;
                    // 删除可能存在的capabilityMap，防止同时存在两者
                    delete baseCard.capabilityMap;
                } else if (card.capabilityMap) {
                    baseCard.capabilityMap = card.capabilityMap;
                }

                return baseCard;
            }
            // 处理serviceLayer的卡片
            else if (section.id === 'serviceLayer') {
                const baseCard = {
                    ...card,
                    displayContent: {
                        en: `${sectionNumber}.${card.index} ${card.content.en}`,
                        zh: `${sectionNumber}.${card.index} ${card.content.zh}`
                    },
                    content: card.content
                };

                // 处理capabilityMap或capabilityMapRef属性
                if (card.capabilityMapRef) {
                    baseCard.capabilityMapRef = card.capabilityMapRef;
                    // 删除可能存在的capabilityMap，防止同时存在两者
                    delete baseCard.capabilityMap;

                    // 尝试从capabilityMapService获取能力地图数据
                    // 注意: 这里不会立即加载数据，由CapabilityMapModal组件处理
                } else if (card.capabilityMap) {
                    baseCard.capabilityMap = card.capabilityMap;
                }

                return baseCard;
            }

            // 处理其他普通卡片
            const baseCard = {
                ...card,
                displayContent: {
                    en: `${sectionNumber}.${card.index} ${card.content.en}`,
                    zh: `${sectionNumber}.${card.index} ${card.content.zh}`
                },
                content: card.content
            };

            // 处理capabilityMap或capabilityMapRef属性
            if (card.capabilityMapRef) {
                baseCard.capabilityMapRef = card.capabilityMapRef;
                // 删除可能存在的capabilityMap，防止同时存在两者
                delete baseCard.capabilityMap;
            } else if (card.capabilityMap) {
                baseCard.capabilityMap = card.capabilityMap;
            }

            return baseCard;
        });

        // 处理子组件
        if (section.subSection) {
            if (!Array.isArray(section.subSection.cards)) {
                section.subSection.cards = [];
            }

            components[section.subSection.id] = section.subSection.cards.map(card => {
                // 生成标准化的二级卡片 ID
                const subCardId = `${section.id}-${card.index}`;

                const subCard = {
                    ...card,
                    id: subCardId, // 使用新的 ID 格式
                    displayContent: {
                        en: `${sectionNumber}.${section.subSection.index}.${card.index} ${card.content.en}`,
                        zh: `${sectionNumber}.${section.subSection.index}.${card.index} ${card.content.zh}`
                    },
                    content: card.content
                };

                // 处理capabilityMap或capabilityMapRef属性
                if (card.capabilityMapRef) {
                    subCard.capabilityMapRef = card.capabilityMapRef;
                    // 删除可能存在的capabilityMap，防止同时存在两者
                    delete subCard.capabilityMap;
                } else if (card.capabilityMap) {
                    subCard.capabilityMap = card.capabilityMap;
                }

                return subCard;
            });
        }
    });

    return components;
};

// 将组件状态转换回数据格式
export const convertComponentsToData = (components, originalData) => {
    const newData = JSON.parse(JSON.stringify(originalData));

    Object.entries(newData.sections).forEach(([sectionNumber, section]) => {
        if (components[section.id]) {
            section.cards = components[section.id].map((card, index) => {
                const baseCard = {
                    id: card.id,
                    index: card.index || index + 1,
                    content: card.content,
                    color: card.color
                };

                // serviceLayer区域的卡片特殊处理
                if (section.id === 'serviceLayer') {
                    // 如果有capabilityMap，替换为capabilityMapRef
                    if (card.capabilityMap) {
                        baseCard.capabilityMapRef = `serviceLayer/${card.id}`;
                        // 不要在JSON中保存capabilityMap，它已经被提取到单独的文件
                    } else if (card.capabilityMapRef) {
                        baseCard.capabilityMapRef = card.capabilityMapRef;
                    }
                } else {
                    // 其他区域保留capabilityMap或capabilityMapRef属性，但不能同时存在
                    if (card.capabilityMapRef) {
                        baseCard.capabilityMapRef = card.capabilityMapRef;
                    } else if (card.capabilityMap) {
                        baseCard.capabilityMap = card.capabilityMap;
                    }
                }

                // 如果是AI编排器或Core AI的卡片，保留分组信息
                if ((section.id === 'aiOrchestrator' || section.id === 'coreAI') && card.group) {
                    return {
                        ...baseCard,
                        group: card.group
                    };
                }

                return baseCard;
            });
        }

        if (section.subSection && components[section.subSection.id]) {
            section.subSection.cards = components[section.subSection.id].map((card, index) => {
                // 如果是新添加的卡片，生成标准化的 ID
                const cardIndex = card.index || index + 1;
                const subCardId = card.id.includes('-') ? card.id : `${section.id}-${cardIndex}`;

                const subCard = {
                    id: subCardId,
                    index: cardIndex,
                    content: card.content,
                    color: card.color
                };

                // 保留capabilityMap或capabilityMapRef属性，但不能同时存在
                if (card.capabilityMapRef) {
                    subCard.capabilityMapRef = card.capabilityMapRef;
                } else if (card.capabilityMap) {
                    subCard.capabilityMap = card.capabilityMap;
                }

                return subCard;
            });
        }
    });

    return newData;
};

// 保存数据到本地存储
export const saveToLocalStorage = (components) => {
    const data = convertComponentsToData(components, architectureData);
    localStorage.setItem('architecture-data', JSON.stringify(data));
};

// 从本地存储加载数据
export const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem('architecture-data');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            return convertDataToComponents(data);
        } catch (e) {
            console.error('Error parsing saved data:', e);
            return convertDataToComponents(architectureData);
        }
    }
    return convertDataToComponents(architectureData);
};

export const saveToFile = async (components) => {
    try {
        const newData = convertComponentsToData(components, architectureData);
        const response = await fetch('/api/save-architecture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData)
        });

        if (!response.ok) {
            throw new Error('保存失败');
        }

        return true;
    } catch (error) {
        console.error('保存文件失败:', error);
        throw error;
    }
}; 