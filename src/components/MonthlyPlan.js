import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TechnologyCard from './TechnologyCard';

const MonthContainer = styled(motion.div)`
  margin-bottom: 30px;
  position: relative;
`;

const MonthHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  position: relative;
`;

const MonthTitleRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const MonthTitle = styled.h3`
  color: rgba(219, 234, 254, 0.95);
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  padding-left: 25px;
  position: relative;
  font-family: 'Michelin Unit Titling', 'Orbitron', sans-serif;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    background: linear-gradient(135deg, #8b5cf6, #d946ef);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.6);
  }
`;

const MonthLine = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.5), rgba(30, 41, 59, 0));
  margin-left: 15px;
  position: relative;
`;

const ReleasesTag = styled.div`
  background: linear-gradient(to right, rgba(139, 92, 246, 0.2), rgba(248, 113, 113, 0.2));
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 12px;
  color: #f0f9ff;
  margin-left: 15px;
  display: flex;
  align-items: center;
  font-family: 'Noto Sans', sans-serif;
  
  &::before {
    content: '•';
    color: #f87171;
    margin-right: 5px;
    font-size: 14px;
  }
`;

const ReleasesList = styled.div`
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 5px 0;
  flex-wrap: nowrap;
  position: absolute;
  left: 20px;
  top: -12px;
  
  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.3);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.5);
    border-radius: 2px;
  }
`;

const ReleaseItem = styled.div`
  display: flex;
  align-items: center;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 4px;
  padding: 3px 8px;
  z-index: 1;
  border-left: 2px solid #a855f7;
  min-width: fit-content;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const ReleaseDate = styled.div`
  font-size: 12px;
  color: rgba(219, 234, 254, 0.7);
  font-family: 'Noto Sans', sans-serif;
  margin-right: 8px;
  padding-right: 8px;
  border-right: 1px solid rgba(139, 92, 246, 0.3);
`;

const ReleaseName = styled.div`
  color: #f0f9ff;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Noto Sans', sans-serif;
`;

// 新增：月度计划标题和价值描述的样式
const MonthPlanInfo = styled.div`
  background: rgba(30, 41, 59, 0.6);
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0 20px 0;
  border-left: 3px solid #8b5cf6;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const MonthPlanTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #f0f9ff;
  font-family: 'Noto Sans', sans-serif;
  
  svg {
    margin-right: 10px;
    color: #a855f7;
  }
`;

const MonthPlanValue = styled.div`
  color: rgba(219, 234, 254, 0.8);
  font-size: 14px;
  line-height: 1.5;
  font-family: 'Noto Sans', sans-serif;
  padding-left: 28px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 8px;
    width: 6px;
    height: 6px;
    background-color: #a855f7;
    border-radius: 50%;
  }
`;

const TechnologiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
`;

const EmptyMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 30px;
  color: rgba(203, 213, 225, 0.7);
  font-style: italic;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
  border: 1px dashed rgba(71, 85, 105, 0.3);
  font-family: 'Noto Sans', sans-serif;
`;

// 辅助函数：获取多语言文本
const getLocalizedText = (textObj, language) => {
  if (!textObj) return '';
  if (typeof textObj === 'string') return textObj;
  return language === 'zh' ? (textObj.zh || '') : (textObj.en || '');
};

// 辅助函数：格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

// 新增：月度计划图标组件
const PlanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

const MonthlyPlan = ({ month, activeTech, language }) => {
  // 根据技术类型筛选能力
  const filteredCapabilities = month.capabilities.filter(cap =>
    activeTech === 'all' || cap.id.startsWith(`C${month.id.substring(1)}.`) || cap.type === activeTech
  );

  const hasReleases = month.releases && month.releases.length > 0;

  return (
    <MonthContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MonthHeader>
        <MonthTitleRow>
          <MonthTitle>{month.month}</MonthTitle>
          <MonthLine>
            {hasReleases && (
              <ReleasesList>
                {month.releases.map((release, index) => (
                  <ReleaseItem key={index}>
                    <ReleaseDate>{formatDate(release.launchDate)}</ReleaseDate>
                    <ReleaseName>{release.name}</ReleaseName>
                  </ReleaseItem>
                ))}
              </ReleasesList>
            )}
          </MonthLine>
          {hasReleases && (
            <ReleasesTag>
              Releases
            </ReleasesTag>
          )}
        </MonthTitleRow>

        {/* 新增：月度计划标题和价值描述 */}
        <MonthPlanInfo>
          <MonthPlanTitle>
            <PlanIcon />
            {getLocalizedText(month.title, language)}
          </MonthPlanTitle>
          <MonthPlanValue>
            {getLocalizedText(month.value, language)}
          </MonthPlanValue>
        </MonthPlanInfo>
      </MonthHeader>

      <TechnologiesGrid>
        {filteredCapabilities.length > 0 ? (
          filteredCapabilities.map((capability) => (
            <TechnologyCard
              key={capability.id}
              id={capability.id}
              content={capability.content}
              technicalImplementation={capability.technicalImplementation || []}
              technicalStudy={capability.technicalStudy || []}
              language={language}
            />
          ))
        ) : (
          <EmptyMessage>
            {language === 'zh'
              ? '该月份未规划相关技术能力'
              : 'No technology capabilities planned for this month'}
          </EmptyMessage>
        )}
      </TechnologiesGrid>
    </MonthContainer>
  );
};

export default MonthlyPlan; 