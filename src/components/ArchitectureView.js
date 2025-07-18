import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { saveToLocalStorage, convertDataToComponents } from '../services/architectureService';
import architectureData from '../data/architecture-cards.json';
import { saveToFile, getLatestArchitecture, getArchitectureVersions, getArchitectureVersion } from '../services/fileService';
import CapabilityMapModal from './CapabilityMapModal';

const COLOR_STATES = {
  MISSING: '#ffffff',
  READY: '#86efac',
  NEED_ENHANCEMENT: '#fdba74',
  CRITICAL: '#f87171'
};

const ArchitectureContainer = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Title = styled.h1`
  color: #f0f9ff;
  font-size: 24px;
  margin-bottom: 6px;
  font-family: var(--font-tech);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  
  span.date {
    color: #a855f7;
  }
`;

const TouchPointsRow = styled.div`
  display: flex;
  gap: 15px;
`;

const TouchPointsSection = styled.div`
  flex: ${props => props.$flex || 1};
  background: #1e3a8a;
  border-radius: 8px;
  padding: 15px;
`;

const SectionTitle = styled.h2`
  color: #f0f9ff;
  font-size: 16px;
  margin: 0 0 15px 0;
  font-family: var(--font-tech);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .title-content {
    display: flex;
    align-items: center;
  }
  
  .title-controls {
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;

const ComponentsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 50px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  align-items: flex-start;
`;

const ComponentBox = styled.div`
  background: ${props => props.$color || '#ffffff'};
  border-radius: 4px;
  padding: 8px 12px;
  color: ${props => props.$color === 'transparent' ? '#ffffff' : '#1a1a1a'};
  font-size: 14px;
  min-width: 120px;
  text-align: center;
  cursor: grab;
  user-select: none;
  position: relative;
  transition: all 0.2s ease;
  margin: 2px;
  border: ${props => props.$color === 'transparent' ? '2px dashed #64748b' : 'none'};
  
  ${props => props.$isDragging && `
    opacity: 0.8;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  `}
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }
  
  &:active {
    cursor: grabbing;
  }
  
  .actions {
    position: absolute;
    top: -8px;
    right: -8px;
    display: none;
    z-index: 10;
    background: rgba(255, 255, 255, 0.9);
    padding: 4px;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  &:hover .actions {
    display: flex;
    gap: 4px;
  }
`;

const ActionButton = styled.button`
  background: #1e3a8a;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 8px;
  
  &:hover {
    background: #2563eb;
    transform: scale(1.1);
  }
`;

const EditInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #2563eb;
  border-radius: 4px;
  font-size: 14px;
  background: white;
`;

const MainContainer = styled.div`
  display: flex;
  gap: 15px;
`;

const LeftColumn = styled.div`
  width: 40px;
  background: #1e3a8a;
  border-radius: 8px;
  writing-mode: vertical-rl;
  text-orientation: upright;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f0f9ff;
  font-family: var(--font-tech);
  font-size: 14px;
  padding: 15px 8px;
  height: auto;
  align-self: stretch;
`;

const ContentColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const RightColumn = styled.div`
  width: 40px;
  background: #1e3a8a;
  border-radius: 8px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f0f9ff;
  font-family: var(--font-tech);
  font-size: 14px;
  padding: 15px 8px;
  height: auto;
  align-self: stretch;
`;

const LayerContainer = styled.div`
  background: #1e3a8a;
  border-radius: 8px;
  padding: 15px;
`;

const LegendContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Legend = styled.div`
  display: flex;
  gap: 15px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #f0f9ff;
`;

const LegendBox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: ${props => props.$color};
  border: ${props => props.$color === 'transparent' ? '2px dashed #64748b' : 'none'};
`;

const SaveButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const GroupContainer = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 15px;
  min-width: 0;
`;

const GroupTitle = styled.div`
  color: #f0f9ff;
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GroupContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  ${props => props.$compact && `
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    
    > div {
      flex: 0 0 auto;
      min-width: 150px;
    }
  `}
`;

const CollapseIcon = styled.span`
  font-size: 14px;
  cursor: pointer;
  color: #f0f9ff;
  margin-right: 8px;
  transition: transform 0.3s ease;
  transform: ${props => props.$isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #f0f9ff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const VersionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #f0f9ff;
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Button = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 10px;
  
  &:hover {
    background: #1d4ed8;
  }
`;

const ArchitectureView = ({ language }) => {
  const [components, setComponents] = useState({
    publicTouchPoints: [],
    adminTouchPoints: [],
    aiOrchestrator: [],
    serviceLayer: [],
    coreAI: [],
    coreAISubComponents: [],
    singleAgentGroup: [],
    multiAgentGroup: [],
    hitlGroup: [],
    rag: [],
    model: [],
    knowledge: [],
    thirdParty: [],
    dataAnalysis: []
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [versions, setVersions] = useState([]);
  const [showVersions, setShowVersions] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [loadingVersion, setLoadingVersion] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    publicTouchPoints: false,
    adminTouchPoints: false,
    aiOrchestrator: false,
    serviceLayer: false,
    coreAI: false,
    rag: false,
    model: false,
    knowledge: false,
    thirdParty: false,
    dataAnalysis: false
  });

  useEffect(() => {
    console.log('初始化组件数据');
    // 初始化所有必要的组件数组
    const initializedComponents = convertDataToComponents(architectureData);
    console.log('初始化的组件数据:', initializedComponents);

    // 确保每个section都有一个初始化的空数组
    const updatedComponents = { ...components };

    Object.entries(architectureData.sections).forEach(([_, section]) => {
      if (!initializedComponents[section.id]) {
        initializedComponents[section.id] = [];
      }
      updatedComponents[section.id] = initializedComponents[section.id];

      if (section.subSection && !initializedComponents[section.subSection.id]) {
        initializedComponents[section.subSection.id] = [];
      }

      if (section.subSection) {
        updatedComponents[section.subSection.id] = initializedComponents[section.subSection.id];
      }
    });

    // 确保AI编排器的分组也被初始化
    if (!updatedComponents.singleAgentGroup) updatedComponents.singleAgentGroup = [];
    if (!updatedComponents.multiAgentGroup) updatedComponents.multiAgentGroup = [];
    if (!updatedComponents.hitlGroup) updatedComponents.hitlGroup = [];

    console.log('最终初始化的组件数据:', updatedComponents);
    setComponents(updatedComponents);
    loadVersions();
  }, []);

  const loadVersions = async () => {
    try {
      const versionList = await getArchitectureVersions();
      setVersions(versionList);
    } catch (error) {
      console.error('加载版本列表失败:', error);
    }
  };

  const loadVersion = async (fileName) => {
    try {
      setLoadingVersion(true);
      const versionData = await getArchitectureVersion(fileName);
      const versionComponents = convertDataToComponents(versionData);
      setComponents(versionComponents);
      setCurrentVersion(versionData._metadata?.version);
      setHasUnsavedChanges(false);
      setShowVersions(false);
    } catch (error) {
      console.error('加载版本失败:', error);
    } finally {
      setLoadingVersion(false);
    }
  };

  const loadLatest = async () => {
    try {
      setLoadingVersion(true);
      const latestData = await getLatestArchitecture();
      const latestComponents = convertDataToComponents(latestData);
      setComponents(latestComponents);
      setCurrentVersion(latestData._metadata?.version);
      setHasUnsavedChanges(false);
      setShowVersions(false);
    } catch (error) {
      console.error('加载最新版本失败:', error);
    } finally {
      setLoadingVersion(false);
    }
  };

  useEffect(() => {
    if (Object.keys(components).length > 0) {
      setHasUnsavedChanges(true);
    }
  }, [components]);

  const getContent = (content) => {
    return typeof content === 'object' ? content[language] : content;
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // 处理分组间的拖拽
    const getGroupId = (droppableId) => {
      if (droppableId.endsWith('Group')) {
        return droppableId.replace('Group', '');
      }
      return null;
    };

    const sourceGroupId = getGroupId(source.droppableId);
    const destGroupId = getGroupId(destination.droppableId);

    // 如果是在分组内或分组间拖拽
    if (sourceGroupId || destGroupId) {
      const list = [...components.aiOrchestrator];

      // 找到源项目在完整列表中的索引
      const sourceItems = list.filter(item => item.group?.id === sourceGroupId);
      const [removed] = sourceItems.splice(source.index, 1);
      const sourceIndex = list.findIndex(item => item.id === removed.id);

      // 如果是跨分组拖拽，更新group信息
      if (destGroupId && sourceGroupId !== destGroupId) {
        removed.group = {
          ...removed.group,
          id: destGroupId
        };
      }

      // 找到目标位置并插入
      const destItems = list.filter(item => item.group?.id === destGroupId);
      const beforeItems = destItems.slice(0, destination.index);
      const lastBeforeItem = beforeItems[beforeItems.length - 1];
      const destIndex = lastBeforeItem
        ? list.findIndex(item => item.id === lastBeforeItem.id) + 1
        : list.findIndex(item => item.group?.id === destGroupId);

      list.splice(sourceIndex, 1);
      list.splice(destIndex, 0, removed);

      setComponents({
        ...components,
        aiOrchestrator: list
      });
      return;
    }

    // 处理其他区域的拖拽
    if (source.droppableId === destination.droppableId) {
      const list = [...components[source.droppableId]];
      const [removed] = list.splice(source.index, 1);
      list.splice(destination.index, 0, removed);

      setComponents({
        ...components,
        [source.droppableId]: list
      });
    } else {
      const sourceList = [...components[source.droppableId]];
      const destList = [...components[destination.droppableId]];
      const [removed] = sourceList.splice(source.index, 1);
      destList.splice(destination.index, 0, removed);

      setComponents({
        ...components,
        [source.droppableId]: sourceList,
        [destination.droppableId]: destList
      });
    }
  };

  // 下面是新增的通用卡片操作方法

  /**
   * 获取指定区域和卡片组的卡片列表和目标卡片
   * @param {string} listId - 区域或卡片组ID
   * @param {number} index - 卡片在过滤后列表中的索引
   * @returns {object} 包含卡片列表、目标卡片信息和索引
   */
  const getCardListAndIndex = (listId, index) => {
    // 处理AI Orchestrator的分组
    if (listId.endsWith('Group')) {
      const groupId = listId.replace('Group', '');
      const list = [...(components.aiOrchestrator || [])];
      const filteredItems = list.filter(item => item.group?.id === groupId);

      if (index >= filteredItems.length) return { valid: false };

      const targetItem = filteredItems[index];
      const targetIndex = list.findIndex(item => item.id === targetItem.id);

      return {
        valid: true,
        sectionId: 'aiOrchestrator',
        list,
        targetIndex,
        targetItem,
        groupId
      };
    }

    // 处理Core AI的分组
    if (listId.startsWith('coreAI')) {
      const groupId = listId === 'coreAIUseCase' ? 'useCase' : 'component';
      const list = [...(components.coreAI || [])];
      const filteredItems = list.filter(item => item.group?.id === groupId);

      if (index >= filteredItems.length) return { valid: false };

      const targetItem = filteredItems[index];
      const targetIndex = list.findIndex(item => item.id === targetItem.id);

      return {
        valid: true,
        sectionId: 'coreAI',
        list,
        targetIndex,
        targetItem,
        groupId
      };
    }

    // 处理其他普通区域
    const list = [...(components[listId] || [])];

    if (index >= list.length) return { valid: false };

    return {
      valid: true,
      sectionId: listId,
      list,
      targetIndex: index,
      targetItem: list[index]
    };
  };

  /**
   * 通用卡片颜色切换函数
   * @param {string} listId - 区域或卡片组ID
   * @param {number} index - 卡片在过滤后列表中的索引
   */
  const toggleCardColor = (listId, index) => {
    const result = getCardListAndIndex(listId, index);
    if (!result.valid) return;

    const { sectionId, list, targetIndex } = result;

    // 获取下一个颜色
    const colors = Object.values(COLOR_STATES);
    const currentIndex = colors.indexOf(list[targetIndex].color);
    const nextIndex = (currentIndex + 1) % colors.length;

    // 更新颜色
    list[targetIndex] = {
      ...list[targetIndex],
      color: colors[nextIndex]
    };

    // 更新状态
    setComponents({
      ...components,
      [sectionId]: list
    });
  };

  /**
   * 通用卡片内容编辑函数
   * @param {string} listId - 区域或卡片组ID
   * @param {number} index - 卡片在过滤后列表中的索引
   * @param {string} newContent - 新的内容
   */
  const editCardContent = (listId, index, newContent) => {
    const result = getCardListAndIndex(listId, index);
    if (!result.valid) return;

    const { sectionId, list, targetIndex, targetItem } = result;

    // 查找区域编号用于生成展示内容
    let sectionNumber = '';
    let subSectionIndex = '';

    // 查找对应的区域编号
    Object.entries(architectureData.sections).forEach(([key, sec]) => {
      if (sec.id === sectionId) {
        sectionNumber = key;
      } else if (sec.subSection && sec.subSection.id === sectionId) {
        sectionNumber = key;
        subSectionIndex = sec.subSection.index;
      }
    });

    // 更新内容
    const updatedItem = {
      ...targetItem,
      content: {
        ...targetItem.content,
        [language]: newContent
      }
    };

    // 更新展示内容
    if (sectionId === 'aiOrchestrator') {
      updatedItem.displayContent = {
        ...targetItem.displayContent,
        [language]: `3.${targetItem.index} ${newContent}`
      };
    } else if (sectionId === 'coreAI') {
      updatedItem.displayContent = {
        ...targetItem.displayContent,
        [language]: `5.${targetItem.index} ${newContent}`
      };
    } else if (subSectionIndex) {
      updatedItem.displayContent = {
        ...targetItem.displayContent,
        [language]: `${sectionNumber}.${subSectionIndex}.${targetItem.index} ${newContent}`
      };
    } else {
      updatedItem.displayContent = {
        ...targetItem.displayContent,
        [language]: `${sectionNumber}.${targetItem.index} ${newContent}`
      };
    }

    list[targetIndex] = updatedItem;

    // 更新状态
    setComponents({
      ...components,
      [sectionId]: list
    });
  };

  /**
   * 通用卡片删除函数
   * @param {string} listId - 区域或卡片组ID
   * @param {number} index - 卡片在过滤后列表中的索引
   */
  const deleteCard = (listId, index) => {
    const result = getCardListAndIndex(listId, index);
    if (!result.valid) return;

    const { sectionId, list, targetIndex } = result;

    // 删除卡片
    list.splice(targetIndex, 1);

    // 更新状态
    setComponents({
      ...components,
      [sectionId]: list
    });
  };

  // 使用新的通用函数替代原有函数
  const toggleColor = (listId, index) => {
    toggleCardColor(listId, index);
  };

  const handleEdit = (listId, index, newContent) => {
    editCardContent(listId, index, newContent);
  };

  const handleDelete = (listId, index) => {
    deleteCard(listId, index);
  };

  const handleEditComplete = () => {
    setEditingId(null);
  };

  const handleAdd = (listId) => {
    // 如果是AI编排器的分组
    if (listId.endsWith('Group')) {
      const groupId = listId.replace('Group', '');
      const newComponents = {
        ...components,
        aiOrchestrator: [...(components.aiOrchestrator || [])]
      };

      // 计算新的索引
      const existingIndexes = newComponents.aiOrchestrator.map(card => card.index);
      let newIndex = 1;
      while (existingIndexes.includes(newIndex)) {
        newIndex++;
      }

      // 生成新的 ID
      const newId = `${groupId}${newIndex}`;

      // 构建新的内容
      const content = {
        en: "New Component",
        zh: "新组件"
      };

      // 构建显示内容
      const displayContent = {
        en: `3.${newIndex} ${content.en}`,
        zh: `3.${newIndex} ${content.zh}`
      };

      // 根据分组设置标题
      let groupTitle;
      if (groupId === 'singleAgent') {
        groupTitle = {
          en: 'Single-Agent Orchestration',
          zh: '单 Agent 编排'
        };
      } else if (groupId === 'multiAgent') {
        groupTitle = {
          en: 'Multi-Agent Orchestration',
          zh: '多 Agent 编排'
        };
      } else if (groupId === 'hitl') {
        groupTitle = {
          en: 'Human-in-the-Loop Orchestration',
          zh: 'HITL 编排'
        };
      }

      newComponents.aiOrchestrator.push({
        id: newId,
        index: newIndex,
        content: content,
        displayContent: displayContent,
        color: COLOR_STATES.MISSING,
        group: {
          id: groupId,
          title: groupTitle
        },
        capabilityMapRef: `aiOrchestrator/${newId}`
      });

      setComponents(newComponents);
      return;
    }
    // 如果是Core AI的分组
    else if (listId.startsWith('coreAI')) {
      const groupId = listId === 'coreAIUseCase' ? 'useCase' : 'component';
      const newComponents = {
        ...components,
        coreAI: [...(components.coreAI || [])]
      };

      // 计算新的索引
      const existingIndexes = newComponents.coreAI.map(card => card.index);
      let newIndex = 1;
      while (existingIndexes.includes(newIndex)) {
        newIndex++;
      }

      // 生成新的 ID
      const newId = `coreAI${newIndex}`;

      // 构建新的内容
      const content = {
        en: "New Component",
        zh: "新组件"
      };

      // 构建显示内容
      const displayContent = {
        en: `5.${newIndex} ${content.en}`,
        zh: `5.${newIndex} ${content.zh}`
      };

      // 设置分组标题
      const groupTitle = groupId === 'useCase' ? {
        en: 'Use Cases',
        zh: '场景用例'
      } : {
        en: 'Components',
        zh: '组件'
      };

      newComponents.coreAI.push({
        id: newId,
        index: newIndex,
        content: content,
        displayContent: displayContent,
        color: COLOR_STATES.MISSING,
        group: {
          id: groupId,
          title: groupTitle
        }
      });

      setComponents(newComponents);
      return;
    }

    // 其他区域的添加逻辑保持不变
    let sectionNumber = '';
    let subSectionIndex = '';
    let parentId = '';

    Object.entries(architectureData.sections).forEach(([key, sec]) => {
      if (sec.id === listId) {
        sectionNumber = key;
      } else if (sec.subSection && sec.subSection.id === listId) {
        sectionNumber = key;
        subSectionIndex = sec.subSection.index;
        parentId = sec.id;
      }
    });

    const newComponents = {
      ...components,
      [listId]: [...(components[listId] || [])]
    };

    const existingIndexes = newComponents[listId].map(card => card.index);
    let newIndex = 1;
    while (existingIndexes.includes(newIndex)) {
      newIndex++;
    }

    let newId;
    if (subSectionIndex) {
      newId = `${parentId}-${newIndex}`;
    } else {
      newId = `${listId}${newIndex}`;
    }

    const content = {
      en: "New Component",
      zh: "新组件"
    };

    let displayContent;
    if (subSectionIndex) {
      displayContent = {
        en: `${sectionNumber}.${subSectionIndex}.${newIndex} ${content.en}`,
        zh: `${sectionNumber}.${subSectionIndex}.${newIndex} ${content.zh}`
      };
    } else {
      displayContent = {
        en: `${sectionNumber}.${newIndex} ${content.en}`,
        zh: `${sectionNumber}.${newIndex} ${content.zh}`
      };
    }

    // 创建新卡片的基本属性
    let newCard = {
      id: newId,
      index: newIndex,
      content: content,
      displayContent: displayContent,
      color: COLOR_STATES.MISSING
    };

    // 为特定区域的卡片添加capabilityMapRef引用
    if (listId === 'publicTouchPoints') {
      newCard.capabilityMapRef = `publicTouchPoints/${newId}`;
    }
    // 如果是adminTouchPoints区域的卡片，也添加capabilityMapRef引用
    else if (listId === 'adminTouchPoints') {
      newCard.capabilityMapRef = `adminTouchPoints/${newId}`;
    }
    // 为serviceLayer卡片添加capabilityMapRef引用
    else if (listId === 'serviceLayer') {
      newCard.capabilityMapRef = `serviceLayer/${newId}`;
    }
    // 为RAG卡片添加正确的capabilityMapRef引用
    else if (listId === 'rag') {
      newCard.capabilityMapRef = `rag/${newId}_${content.en.toLowerCase().replace(/\s+/g, '')}.json`;
    }
    // 为Model卡片添加正确的capabilityMapRef引用
    else if (listId === 'model') {
      newCard.capabilityMapRef = `model/${newId}_${content.en.toLowerCase().replace(/\s+/g, '')}.json`;
    }

    newComponents[listId].push(newCard);
    setComponents(newComponents);
  };

  const handleSave = async () => {
    try {
      // 首先提取serviceLayer的能力地图
      try {
        const { extractAndSaveServiceLayerCapabilityMaps } = await import('../services/capabilityMapService');
        const result = await extractAndSaveServiceLayerCapabilityMaps();
        if (!result.success) {
          console.warn('提取serviceLayer能力地图失败:', result.message);
        } else {
          console.log('已成功提取并保存serviceLayer能力地图');
        }
      } catch (error) {
        console.warn('提取serviceLayer能力地图时出错:', error);
      }

      // 保存到 localStorage
      const componentsToSave = {
        ...components,
        // 确保aiOrchestrator中的卡片保留其分组信息
        aiOrchestrator: components.aiOrchestrator?.map(card => ({
          ...card,
          group: card.group // 保留原有的分组信息
        })),
        // 确保coreAI中的卡片保留其分组信息
        coreAI: components.coreAI?.map(card => ({
          ...card,
          group: card.group // 保留原有的分组信息
        }))
      };

      saveToLocalStorage(componentsToSave);

      // 保存到文件
      const result = await saveToFile(componentsToSave);

      if (result && result.version) {
        setCurrentVersion(result.version);
        // 刷新版本列表
        loadVersions();
      }

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('保存失败:', error);
      // 这里可以添加错误提示
      alert(language === 'zh' ? '保存失败' : 'Save failed');
    }
  };

  const renderDraggableComponent = (item, index, listId, sectionId) => (
    <Draggable
      key={item.id}
      draggableId={item.id}
      index={index}
    >
      {(provided, snapshot) => (
        <ComponentBox
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          $isDragging={snapshot.isDragging}
          $color={item.color}
          onClick={() => toggleColor(listId, index)}
        >
          {editingId === item.id ? (
            <EditInput
              type="text"
              defaultValue={getContent(item.content)}
              onBlur={(e) => {
                handleEdit(listId, index, e.target.value);
                handleEditComplete();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEdit(listId, index, e.target.value);
                  handleEditComplete();
                }
                if (e.key === 'Escape') {
                  handleEditComplete();
                }
              }}
              autoFocus
            />
          ) : (
            <>
              {getContent(item.displayContent || item.content)}
              <div className="actions">
                {(item.capabilityMap || item.capabilityMapRef) && (
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCard({ ...item, sectionId });
                      setIsModalOpen(true);
                    }}
                    title={language === 'zh' ? '查看能力地图' : 'View Capability Map'}
                  >
                    📊
                  </ActionButton>
                )}
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(item.id);
                  }}
                  title={language === 'zh' ? '编辑' : 'Edit'}
                >
                  ✎
                </ActionButton>
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(listId, index);
                  }}
                  title={language === 'zh' ? '删除' : 'Delete'}
                >
                  ×
                </ActionButton>
              </div>
            </>
          )}
        </ComponentBox>
      )}
    </Draggable>
  );

  const toggleSection = (sectionId) => {
    setCollapsedSections({
      ...collapsedSections,
      [sectionId]: !collapsedSections[sectionId]
    });
  };

  // 添加一键展开/收缩所有卡片的功能函数
  const expandAllSections = useCallback(() => {
    const sections = {};
    Object.keys(collapsedSections).forEach(section => {
      sections[section] = false;
    });
    setCollapsedSections(sections);
  }, []);

  const collapseAllSections = useCallback(() => {
    const sections = {};
    Object.keys(collapsedSections).forEach(section => {
      sections[section] = true;
    });
    setCollapsedSections(sections);
  }, []);

  // Section组件 - 重构代码结构，提取出通用的Section组件
  const Section = ({
    sectionId,
    title,
    children,
    addHandler,
    flex = 1,
    showAddButton = true
  }) => (
    <TouchPointsSection $flex={flex}>
      <SectionTitle>
        <div className="title-content">
          <span>{title}</span>
        </div>
        <div className="title-controls">
          <CollapseIcon
            $isCollapsed={collapsedSections[sectionId]}
            onClick={() => toggleSection(sectionId)}
          >
            ▼
          </CollapseIcon>
          {showAddButton && (
            <ActionButton onClick={() => addHandler(sectionId)}>+</ActionButton>
          )}
        </div>
      </SectionTitle>
      {!collapsedSections[sectionId] && children}
    </TouchPointsSection>
  );

  // 将Droppable内容提取为组件
  const DroppableArea = ({ droppableId, renderItems }) => (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <ComponentsRow
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {renderItems()}
          {provided.placeholder}
        </ComponentsRow>
      )}
    </Droppable>
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <ArchitectureContainer>
        <Title>
          {getContent(architectureData.title)}
          <span className="date">{getContent(architectureData.targetDate)}</span>
        </Title>

        {currentVersion && (
          <div style={{
            textAlign: 'center',
            color: '#a1a1aa',
            fontSize: '14px',
            marginBottom: '10px'
          }}>
            {language === 'zh' ? '当前版本: ' : 'Current version: '}
            {new Date(currentVersion).toLocaleString()}
          </div>
        )}

        {/* 图例与控制按钮在同一行 */}
        <LegendContainer>
          <Legend>
            {Object.entries(architectureData.legend).map(([key, value]) => (
              <LegendItem key={key}>
                <LegendBox $color={value.color} />
                <span>{getContent(value)}</span>
              </LegendItem>
            ))}
            <LegendItem style={{ marginLeft: '15px', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '15px' }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontSize: '16px' }}>📊</span>
                {language === 'zh' ? '点击卡片按钮查看详细能力地图' : 'Click card button to view detailed capability map'}
              </span>
            </LegendItem>
          </Legend>

          <ControlsContainer>
            {/* 暂时隐藏版本历史功能，因为存在bug
            <VersionButton onClick={() => setShowVersions(!showVersions)}>
              {language === 'zh' ? '版本历史' : 'Version History'}
              <span>📋</span>
            </VersionButton>

            {showVersions && (
              <VersionButton
                onClick={loadLatest}
                disabled={loadingVersion}
                style={{ color: '#86efac' }}
              >
                {language === 'zh' ? '最新版本' : 'Latest'}
                <span>⏱️</span>
              </VersionButton>
            )}
            */}

            <ControlButton onClick={expandAllSections}>
              {language === 'zh' ? '展开所有' : 'Expand All'}
              <span>🔽</span>
            </ControlButton>

            <ControlButton onClick={collapseAllSections}>
              {language === 'zh' ? '收起所有' : 'Collapse All'}
              <span>🔼</span>
            </ControlButton>
          </ControlsContainer>
        </LegendContainer>

        {/* 暂时隐藏版本历史功能，因为存在bug
        {showVersions && (
          <div style={{
            background: '#1e293b',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            <h3 style={{ color: '#f0f9ff', margin: '0 0 10px 0', fontSize: '16px' }}>
              {language === 'zh' ? '版本历史' : 'Version History'}
            </h3>
            {versions.length === 0 ? (
              <p style={{ color: '#a1a1aa' }}>
                {language === 'zh' ? '暂无历史版本' : 'No version history available'}
              </p>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {versions.map((version, index) => (
                  <li key={index} style={{
                    margin: '8px 0',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    background: '#2d3748',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: '#e2e8f0' }}>{version.date}</span>
                    <button
                      onClick={() => loadVersion(version.file)}
                      disabled={loadingVersion}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer'
                      }}
                    >
                      {language === 'zh' ? '加载' : 'Load'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        */}

        <MainContainer>
          <LeftColumn>
            <div>{getContent(architectureData.leftColumn.ecosystem)}</div>
          </LeftColumn>

          <ContentColumn>
            <TouchPointsRow>
              {/* 使用重构后的Section组件 */}
              <Section
                sectionId="publicTouchPoints"
                title={getContent(architectureData.sections['1'].title)}
                addHandler={handleAdd}
                flex={2}
              >
                <DroppableArea
                  droppableId="publicTouchPoints"
                  renderItems={() => (components.publicTouchPoints || []).map((item, index) =>
                    renderDraggableComponent(item, index, 'publicTouchPoints', 'publicTouchPoints')
                  )}
                />
              </Section>

              <Section
                sectionId="adminTouchPoints"
                title={getContent(architectureData.sections['2'].title)}
                addHandler={handleAdd}
              >
                <DroppableArea
                  droppableId="adminTouchPoints"
                  renderItems={() => (components.adminTouchPoints || []).map((item, index) =>
                    renderDraggableComponent(item, index, 'adminTouchPoints', 'adminTouchPoints')
                  )}
                />
              </Section>
            </TouchPointsRow>

            {/* 其他部分继续使用Section组件重构 */}
            <Section
              sectionId="aiOrchestrator"
              title={getContent(architectureData.sections['3'].title)}
              addHandler={handleAdd}
              showAddButton={false}
            >
              <div style={{ display: 'flex', gap: '15px' }}>
                <GroupContainer style={{ flex: 1 }}>
                  <GroupTitle>
                    <span>Single-Agent Orchestration（单 Agent 编排）</span>
                    <ActionButton onClick={() => handleAdd('singleAgentGroup')}>+</ActionButton>
                  </GroupTitle>
                  <Droppable droppableId="singleAgentGroup">
                    {(provided) => (
                      <GroupContent
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {(components.aiOrchestrator || [])
                          .filter(item => item.group?.id === 'singleAgent')
                          .map((item, index) =>
                            renderDraggableComponent(item, index, 'singleAgentGroup', 'singleAgentGroup')
                          )}
                        {provided.placeholder}
                      </GroupContent>
                    )}
                  </Droppable>
                </GroupContainer>

                <GroupContainer style={{ flex: 1 }}>
                  <GroupTitle>
                    <span>Multi-Agent Orchestration（多 Agent 编排）</span>
                    <ActionButton onClick={() => handleAdd('multiAgentGroup')}>+</ActionButton>
                  </GroupTitle>
                  <Droppable droppableId="multiAgentGroup">
                    {(provided) => (
                      <GroupContent
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {(components.aiOrchestrator || [])
                          .filter(item => item.group?.id === 'multiAgent')
                          .map((item, index) =>
                            renderDraggableComponent(item, index, 'multiAgentGroup', 'multiAgentGroup')
                          )}
                        {provided.placeholder}
                      </GroupContent>
                    )}
                  </Droppable>
                </GroupContainer>

                <GroupContainer style={{ flex: 1 }}>
                  <GroupTitle>
                    <span>Human-in-the-Loop Orchestration（HITL 编排）</span>
                    <ActionButton onClick={() => handleAdd('hitlGroup')}>+</ActionButton>
                  </GroupTitle>
                  <Droppable droppableId="hitlGroup">
                    {(provided) => (
                      <GroupContent
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {(components.aiOrchestrator || [])
                          .filter(item => item.group?.id === 'hitl')
                          .map((item, index) =>
                            renderDraggableComponent(item, index, 'hitlGroup', 'hitlGroup')
                          )}
                        {provided.placeholder}
                      </GroupContent>
                    )}
                  </Droppable>
                </GroupContainer>
              </div>
            </Section>

            <Section
              sectionId="serviceLayer"
              title={getContent(architectureData.sections['4'].title)}
              addHandler={handleAdd}
            >
              <DroppableArea
                droppableId="serviceLayer"
                renderItems={() => (components.serviceLayer || []).map((item, index) =>
                  renderDraggableComponent(item, index, 'serviceLayer', 'serviceLayer')
                )}
              />
            </Section>

            {/* Core AI和RAG部分 */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <LayerContainer style={{ flex: 2 }}>
                <SectionTitle>
                  <div className="title-content">
                    <span>{getContent(architectureData.sections['5'].title)}</span>
                  </div>
                  <div className="title-controls">
                    <CollapseIcon
                      $isCollapsed={collapsedSections.coreAI}
                      onClick={() => toggleSection('coreAI')}
                    >
                      ▼
                    </CollapseIcon>
                    <ActionButton onClick={() => handleAdd('coreAI')}>+</ActionButton>
                  </div>
                </SectionTitle>
                {!collapsedSections.coreAI && (
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <GroupContainer style={{ flex: 1 }}>
                      <GroupTitle>
                        {components.coreAI && components.coreAI.length > 0 &&
                          components.coreAI[0].group && getContent(components.coreAI[0].group.title)}
                      </GroupTitle>
                      <Droppable droppableId="coreAIUseCase">
                        {(provided) => (
                          <GroupContent
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {(components.coreAI || [])
                              .filter(item => item.group?.id === 'useCase')
                              .map((item, index) =>
                                renderDraggableComponent(item, index, 'coreAIUseCase', 'coreAI')
                              )}
                            {provided.placeholder}
                          </GroupContent>
                        )}
                      </Droppable>
                    </GroupContainer>

                    <GroupContainer style={{ flex: 1 }}>
                      <GroupTitle>
                        {components.coreAI && components.coreAI.length > 0 &&
                          components.coreAI.find(item => item.group?.id === 'component')?.group &&
                          getContent(components.coreAI.find(item => item.group?.id === 'component').group.title)}
                      </GroupTitle>
                      <Droppable droppableId="coreAIComponent">
                        {(provided) => (
                          <GroupContent
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {(components.coreAI || [])
                              .filter(item => item.group?.id === 'component')
                              .map((item, index) =>
                                renderDraggableComponent(item, index, 'coreAIComponent', 'coreAI')
                              )}
                            {provided.placeholder}
                          </GroupContent>
                        )}
                      </Droppable>
                    </GroupContainer>
                  </div>
                )}
              </LayerContainer>

              <Section
                sectionId="rag"
                title={getContent(architectureData.sections['6'].title)}
                addHandler={handleAdd}
                flex={1}
              >
                <DroppableArea
                  droppableId="rag"
                  renderItems={() => (components.rag || []).map((item, index) =>
                    renderDraggableComponent(item, index, 'rag', 'rag')
                  )}
                />
              </Section>
            </div>

            {/* Model、Knowledge和3rd Party部分 */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <LayerContainer style={{ flex: 1 }}>
                <SectionTitle>
                  <div className="title-content">
                    <span>{getContent(architectureData.sections['7'].title)}</span>
                  </div>
                  <div className="title-controls">
                    <CollapseIcon
                      $isCollapsed={collapsedSections.model}
                      onClick={() => toggleSection('model')}
                    >
                      ▼
                    </CollapseIcon>
                    <ActionButton onClick={() => handleAdd('model')}>+</ActionButton>
                  </div>
                </SectionTitle>
                {!collapsedSections.model && (
                  <DroppableArea
                    droppableId="model"
                    renderItems={() => (components.model || []).map((item, index) =>
                      renderDraggableComponent(item, index, 'model', 'model')
                    )}
                  />
                )}
              </LayerContainer>

              <LayerContainer style={{ flex: 1 }}>
                <SectionTitle>
                  <div className="title-content">
                    <span>{language === 'zh' ? '知识库' : 'Knowledge'}</span>
                  </div>
                  <div className="title-controls">
                    <CollapseIcon
                      $isCollapsed={collapsedSections.knowledge}
                      onClick={() => toggleSection('knowledge')}
                    >
                      ▼
                    </CollapseIcon>
                    <ActionButton onClick={() => handleAdd('knowledge')}>+</ActionButton>
                  </div>
                </SectionTitle>
                {!collapsedSections.knowledge && (
                  <DroppableArea
                    droppableId="knowledge"
                    renderItems={() => (components.knowledge || []).map((item, index) =>
                      renderDraggableComponent(item, index, 'knowledge', 'knowledge')
                    )}
                  />
                )}
              </LayerContainer>

              <LayerContainer style={{ flex: 1 }}>
                <SectionTitle>
                  <div className="title-content">
                    <span>{language === 'zh' ? '第三方服务' : '3rd Party'}</span>
                  </div>
                  <div className="title-controls">
                    <CollapseIcon
                      $isCollapsed={collapsedSections.thirdParty}
                      onClick={() => toggleSection('thirdParty')}
                    >
                      ▼
                    </CollapseIcon>
                    <ActionButton onClick={() => handleAdd('thirdParty')}>+</ActionButton>
                  </div>
                </SectionTitle>
                {!collapsedSections.thirdParty && (
                  <DroppableArea
                    droppableId="thirdParty"
                    renderItems={() => (components.thirdParty || []).map((item, index) =>
                      renderDraggableComponent(item, index, 'thirdParty', 'thirdParty')
                    )}
                  />
                )}
              </LayerContainer>
            </div>

            <Section
              sectionId="dataAnalysis"
              title={getContent(architectureData.sections['10'].title)}
              addHandler={handleAdd}
            >
              <DroppableArea
                droppableId="dataAnalysis"
                renderItems={() => (components.dataAnalysis || []).map((item, index) =>
                  renderDraggableComponent(item, index, 'dataAnalysis', 'dataAnalysis')
                )}
              />
            </Section>
          </ContentColumn>

          <RightColumn>
            <div>{getContent(architectureData.rightColumn.trustworthy)}</div>
            <div style={{ height: '20px' }}></div>
            <div>{getContent(architectureData.rightColumn.logging)}</div>
          </RightColumn>
        </MainContainer>

        <SaveButton
          onClick={handleSave}
          style={{ opacity: hasUnsavedChanges ? 1 : 0.5 }}
        >
          {hasUnsavedChanges ? (language === 'zh' ? '保存更改' : 'Save Changes') : (language === 'zh' ? '已保存' : 'Saved')}
          {hasUnsavedChanges ? '💾' : '✓'}
        </SaveButton>

        <CapabilityMapModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          capabilityMap={selectedCard?.capabilityMap}
          capabilityMapRef={selectedCard?.capabilityMapRef}
          sectionId={selectedCard?.sectionId}
          cardId={selectedCard?.id}
          language={language}
        />
      </ArchitectureContainer>
    </DragDropContext>
  );
};

export default ArchitectureView; 