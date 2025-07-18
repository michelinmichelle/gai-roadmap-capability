import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { getCapabilityMap } from '../services/capabilityMapService';
import NoDataComponent from './CapabilityColumnsWrapper';
import CapabilityExpansionControls from './CapabilityExpansionControls';
import CapabilityStats from './CapabilityStats';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 1200px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  color: #ffffff;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  &:hover {
    opacity: 0.8;
  }
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  font-size: 1.8rem;
  color: #ffffff;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
`;

const SubTitle = styled.span`
  font-size: 1.2rem;
  color: #ffffff;
  font-weight: 600;
  margin-top: 0.5rem;
  padding: 0.3rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
`;

const CapabilityColumnsWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  padding-bottom: 10px;
  
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const CapabilityColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(180px, 1fr));
  gap: 20px;
  width: 100%;
  margin-top: 20px;
  min-width: 1100px;
`;

const CapabilityColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ColumnTitle = styled.h3`
  font-size: 16px;
  margin: 0;
  padding: 12px;
  background-color: ${props => props.isDashed ? 'rgba(255, 255, 255, 0.08)' : props.color || '#e5e7eb'};
  border-radius: 6px;
  color: ${props => props.isDashed ? '#ffffff' : props.textColor || '#111827'};
  text-align: center;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${props => props.isDashed ? '2px dashed rgba(255, 255, 255, 0.3)' : 'none'};
  font-weight: ${props => props.isDashed ? '600' : 'normal'};
  backdrop-filter: blur(4px);
`;

const GroupTitle = styled.h4`
  margin: 10px 0 5px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
`;

const CapabilityCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: ${props => props.isExpanded ? '1.2rem' : '0.6rem 0.8rem'};
  border-radius: 8px;
  border-left: 4px solid ${props => props.color};
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: ${props => props.isExpanded ? 'auto' : '40px'};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
`;

const CapabilityCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: ${props => props.isExpanded ? 'flex-start' : 'center'};
  gap: 1rem;
  height: ${props => props.isExpanded ? 'auto' : '24px'};
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  h4 {
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
    font-size: ${props => props.isExpanded ? '1rem' : '0.85rem'};
    font-weight: 600;
    line-height: ${props => props.isExpanded ? '1.4' : '1.2'};
    white-space: ${props => props.isExpanded ? 'normal' : 'nowrap'};
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const PriorityBadge = styled.div`
  display: ${props => props.isExpanded ? 'flex' : 'none'};
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: ${props => props.isExpanded ? '5px' : '2px'};
`;

const PriorityDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const ToggleIcon = styled.span`
  font-size: ${props => props.isExpanded ? '18px' : '14px'};
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'};
  flex-shrink: 0;
  
  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const CapabilityCardContent = styled(motion.div)`
  overflow: hidden;
  padding-top: 0.5rem;
  
  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const StatusBadge = styled.div`
  display: inline-block;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
`;

// 获取优先级对应的颜色
const getPriorityColor = (priority) => {
  if (!priority?.level && priority?.level !== 0) return '#6b7280'; // 灰色表示未设置优先级

  switch (priority.level) {
    case 0:
      return '#10b981'; // 绿色表示普通优先级
    case 1:
      return '#f59e0b'; // 橙色表示高优先级
    case 2:
      return '#ef4444'; // 红色表示关键优先级
    case 3:
      return '#6b7280'; // 灰色表示低优先级
    default:
      return '#6b7280'; // 灰色表示未设置优先级
  }
};

// 卡片组件提取为独立组件
const CapabilityCardComponent = ({ capability, color, language, index, isExpanded: isGlobalExpanded, category }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // 响应全局展开状态变化
  useEffect(() => {
    if (isGlobalExpanded !== undefined) {
      setIsExpanded(isGlobalExpanded);
    }
  }, [isGlobalExpanded]);

  const toggleExpand = (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    setIsExpanded(!isExpanded);
  };

  // 确保capability.name存在，否则使用合理的默认值
  const name = capability.name && capability.name[language]
    ? capability.name[language]
    : (capability.name || '未命名能力');

  // 确保description字段存在且有对应语言的值
  const description = capability.description && capability.description[language]
    ? capability.description[language]
    : (capability.description || '');

  // 构建cardRef，格式为 "category/ref"
  const cardRef = `${category}/${capability.ref}`;

  // 获取状态文本
  const getStatusText = (status) => {
    switch (status) {
      case 'inProgress':
        return language === 'zh' ? '进行中' : 'In Progress';
      case 'planned':
        return language === 'zh' ? '计划中' : 'Planned';
      case 'experimental':
        return language === 'zh' ? '实验中' : 'Experimental';
      case 'sketch':
        return language === 'zh' ? '构想中' : 'Sketch';
      case 'needEnhancement':
        return language === 'zh' ? '需要增强' : 'Need Enhancement';
      default:
        return status;
    }
  };

  return (
    <CapabilityCard
      color={color}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={toggleExpand}
      isExpanded={isExpanded}
    >
      <CapabilityCardHeader isExpanded={isExpanded}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <h4>{name}</h4>
          {capability.priority && isExpanded && (
            <PriorityBadge isExpanded={isExpanded}>
              <PriorityDot color={getPriorityColor(capability.priority)} />
              {language === 'zh' ? '优先级: ' : 'Priority: '}
              {capability.priority?.label && capability.priority.label[language]}
            </PriorityBadge>
          )}
        </div>
        <ToggleIcon isExpanded={isExpanded} onClick={toggleExpand}>▼</ToggleIcon>
      </CapabilityCardHeader>

      <AnimatePresence>
        {isExpanded && (
          <CapabilityCardContent
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
              opacity: { duration: 0.3 }
            }}
          >
            {description && <p>{description}</p>}

            <div className="flex flex-wrap gap-2 mt-3">
              {capability.status && capability.status !== 'ready' && (
                <StatusBadge>
                  {getStatusText(capability.status)}
                </StatusBadge>
              )}
              <CapabilityStats cardRef={cardRef} />
            </div>
          </CapabilityCardContent>
        )}
      </AnimatePresence>
    </CapabilityCard>
  );
};

// 列组件提取为独立组件
const CapabilityColumnComponent = ({ title, groups, color, language, isDashed, isExpanded, category }) => {
  // 记录已经显示过的标题，避免重复显示
  const displayedTitles = new Set();

  // 检查是否所有组都属于同一个卡片/标题
  const allSameTitle = groups.length > 0 && groups.every(g =>
    g.title && JSON.stringify(g.title) === JSON.stringify(groups[0].title)
  );

  return (
    <CapabilityColumn>
      <ColumnTitle color={color} isDashed={isDashed}>
        {title}
      </ColumnTitle>
      {groups?.length > 0 && groups.map((group, index) => {
        // 检查标题是否已经显示过或是否所有组都是同一个标题（只显示一次）
        const titleKey = group.title ? JSON.stringify(group.title) : '';
        const shouldShowTitle = group.title && !displayedTitles.has(titleKey) && !allSameTitle;

        // 如果标题要显示，添加到已显示集合中
        if (shouldShowTitle) {
          displayedTitles.add(titleKey);
        }

        return (
          <React.Fragment key={`${title.toLowerCase()}-${index}`}>
            {shouldShowTitle && (
              <GroupTitle>
                {group.title[language]}
              </GroupTitle>
            )}
            {group.capabilities ? (
              group.capabilities.map((capability, capIndex) => (
                <CapabilityCardComponent
                  key={`${title.toLowerCase()}-${index}-${capIndex}`}
                  capability={capability}
                  color={color}
                  language={language}
                  index={capIndex}
                  isExpanded={isExpanded}
                  category={category}
                />
              ))
            ) : (
              <CapabilityCardComponent
                key={`${title.toLowerCase()}-${index}-single`}
                capability={group}
                color={color}
                language={language}
                index={index}
                isExpanded={isExpanded}
                category={category}
              />
            )}
          </React.Fragment>
        );
      })}
    </CapabilityColumn>
  );
};

// 添加这个helper函数来处理新格式的能力地图数据
const processCapabilityMapData = (capabilityMap) => {
  // 检查是否为null或undefined
  if (!capabilityMap) {
    console.log('能力地图数据为空，返回空对象');
    return {};
  }

  // 检查是否是新格式数据 (有id, metadata和capabilities字段的结构)
  if (capabilityMap && capabilityMap.id && capabilityMap.metadata) {
    console.log('检测到新格式能力地图数据，直接返回原始结构');
    // 直接返回原始数据，不进行转换
    return capabilityMap;
  }

  // 如果不是新格式，直接返回原数据
  return capabilityMap;
};

const CapabilityMapModal = ({ isOpen, onClose, capabilityMap, capabilityMapRef, sectionId, cardId, language = 'zh', cardTitle }) => {
  const [loadedCapabilityMap, setLoadedCapabilityMap] = useState(null);
  const [columnConfig, setColumnConfig] = useState([]);
  const [capabilityMapTitle, setCapabilityMapTitle] = useState('');
  const [globalExpanded, setGlobalExpanded] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (capabilityMapRef && isOpen) {
      // 清除上一次加载的数据
      setLoadedCapabilityMap(null);

      console.log(`准备加载能力地图: ${capabilityMapRef}`);

      // 确定正确的sectionId和cardId
      let effectiveSectionId = sectionId;
      let effectiveCardId = capabilityMapRef;

      // 处理带路径的引用 (section/file)
      if (capabilityMapRef.includes('/')) {
        const [refSectionId, refCardId] = capabilityMapRef.split('/');
        effectiveSectionId = refSectionId;
        effectiveCardId = refCardId;
        setCategory(refSectionId);

        console.log(`找到路径格式的引用: ${effectiveSectionId}/${effectiveCardId}`);

        // 检查是否是新格式的pt_*.json文件
        if (effectiveCardId.startsWith('pt_') && effectiveCardId.endsWith('.json')) {
          console.log(`检测到新格式pt_文件引用: ${effectiveSectionId}/${effectiveCardId}`);
        }
      } else {
        // 处理不带路径的引用，保持原有逻辑
        if (capabilityMapRef.startsWith('serviceLayer')) {
          effectiveSectionId = 'serviceLayer';
        }
        setCategory(effectiveSectionId);
      }

      console.log(`尝试加载能力地图: 区域=${effectiveSectionId}, 卡片ID=${effectiveCardId}, 分类=${category}`);

      getCapabilityMap(effectiveSectionId, effectiveCardId)
        .then(mapData => {
          console.log(`卡片 ${effectiveCardId} 能力地图加载结果:`, mapData ? '成功' : '失败');
          if (mapData) {
            setLoadedCapabilityMap(mapData);
          }
        })
        .catch(error => {
          console.error(`加载能力地图数据出错:`, error);
        });
    }
  }, [capabilityMapRef, isOpen, sectionId]);

  useEffect(() => {
    if ((capabilityMap || loadedCapabilityMap) && isOpen) {
      const processedData = capabilityMap || loadedCapabilityMap;
      console.log('处理能力地图数据:', processedData);

      // 设置标题
      if (processedData.metadata?.title) {
        setCapabilityMapTitle(processedData.metadata.title);
      }

      // 定义所有可能的状态类型
      const allStatusTypes = [
        { type: 'ready', title: language === 'zh' ? '有的能力' : 'READY' },
        { type: 'needEnhancement', title: language === 'zh' ? '有但需要加强' : 'READY BUT ENHANCEMENT' },
        { type: 'missing', title: language === 'zh' ? '没有的能力' : 'MISSING' },
        { type: 'critical', title: language === 'zh' ? '关键但缺失' : 'CRITICAL MISSING' },
        { type: 'experimental', title: language === 'zh' ? '限制或实验' : 'CONSTRAINTS OR EXPERIMENTAL' }
      ];

      // 初始化状态组
      const statusGroups = allStatusTypes.reduce((acc, { type }) => {
        acc[type] = { type, groups: [] };
        return acc;
      }, {});

      // 检查是否为新格式数据 (id, metadata, capabilities)
      if (processedData.id && processedData.metadata && Array.isArray(processedData.capabilities)) {
        console.log("检测到新格式能力数据，直接按每个能力的状态分类");

        // 对每个能力按其状态进行分类
        processedData.capabilities.forEach(capability => {
          if (!capability) return;

          // 获取能力状态
          const capStatus = capability.status || 'needEnhancement';

          // 确保该状态组存在
          if (!statusGroups[capStatus]) {
            statusGroups.experimental.groups.push({
              key: `unknown_${capStatus}`,
              title: processedData.metadata.title,
              capabilities: [capability]
            });
            return;
          }

          // 将能力添加到对应状态组
          statusGroups[capStatus].groups.push({
            key: `${capStatus}_${capability.id}`,
            title: processedData.metadata.title,
            capabilities: [capability]
          });
        });
      } else {
        // 处理旧格式数据
        Object.entries(processedData).forEach(([key, value]) => {
          if (key === 'metadata' || key === 'id' || key === 'ref') return;

          const group = {
            key,
            title: value.title,
            capabilities: value.capabilities || []
          };

          // 根据能力状态分类
          group.capabilities.forEach(capability => {
            const status = capability.status || 'needEnhancement';
            if (statusGroups[status]) {
              statusGroups[status].groups.push({
                ...group,
                capabilities: [capability]
              });
            }
          });
        });
      }

      // 转换为数组格式,确保所有状态类型都包含
      const newColumns = allStatusTypes.map(({ type }) => ({
        type,
        groups: statusGroups[type].groups || []
      }));

      console.log('处理后的能力地图数据:', newColumns);
      setColumnConfig(newColumns);
    }
  }, [capabilityMap, loadedCapabilityMap, isOpen, language]);

  // 获取有效的能力地图数据
  const effectiveCapabilityMap = capabilityMap || loadedCapabilityMap;

  if (!isOpen || !effectiveCapabilityMap) return null;

  // 一键展开所有卡片
  const handleExpandAll = () => {
    setGlobalExpanded(true);
  };

  // 一键收起所有卡片
  const handleCollapseAll = () => {
    setGlobalExpanded(false);
  };

  // 根据状态获取标题
  const getStatusTitle = (status) => {
    switch (status) {
      case 'ready':
        return language === 'zh' ? '有的能力' : 'READY';
      case 'needEnhancement':
        return language === 'zh' ? '有但需要加强' : 'READY BUT ENHANCEMENT';
      case 'missing':
        return language === 'zh' ? '没有的能力' : 'MISSING';
      case 'critical':
        return language === 'zh' ? '关键但缺失' : 'CRITICAL MISSING';
      case 'experimental':
        return language === 'zh' ? '限制或实验' : 'CONSTRAINTS OR EXPERIMENTAL';
      default:
        return status;
    }
  };

  // 根据状态获取颜色
  const getStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return '#86efac'; // 绿色表示有的能力
      case 'needEnhancement':
        return '#fdba74'; // 橙色表示有但需要加强
      case 'missing':
        return '#ffffff'; // 白色表示没有的能力
      case 'experimental':
        return 'transparent'; // 透明背景用于虚框
      case 'critical':
        return '#f87171'; // 红色表示关键但缺失
      default:
        return '#e5e7eb'; // 默认灰色
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>&times;</CloseButton>
            <CapabilityExpansionControls
              onExpandAll={handleExpandAll}
              onCollapseAll={handleCollapseAll}
              language={language}
            />
            <Title>
              {language === 'zh' ? '能力地图' : 'Capability Map'}
              <SubTitle>
                {capabilityMapTitle && capabilityMapTitle[language] ?
                  capabilityMapTitle[language] :
                  (cardTitle && typeof cardTitle === 'object' ? cardTitle[language] : '')}
              </SubTitle>
            </Title>

            <CapabilityColumnsWrapper>
              {columnConfig.length > 0 ? (
                <CapabilityColumns>
                  {columnConfig.map((column) => (
                    <CapabilityColumnComponent
                      key={column.type}
                      title={getStatusTitle(column.type)}
                      groups={column.groups || []}
                      color={getStatusColor(column.type)}
                      language={language}
                      isDashed={column.type === 'experimental'}
                      isExpanded={globalExpanded}
                      category={category}
                    />
                  ))}
                </CapabilityColumns>
              ) : (
                <NoDataComponent language={language} />
              )}
            </CapabilityColumnsWrapper>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default CapabilityMapModal; 