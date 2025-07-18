import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import QuarterSelector from './QuarterSelector';
import TechnologySelector from './TechnologySelector';
import MonthlyPlan from './MonthlyPlan';
import RoadmapTimeline from './RoadmapTimeline';

const RoadmapContainer = styled(motion.div)`
  padding: 20px;
  
  @media (min-width: 768px) {
    padding: 30px;
  }
`;

// 新增：整体目标容器样式
const OverallGoalContainer = styled.div`
  margin-bottom: 30px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(71, 85, 105, 0.3);
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

// 修改：整体目标标题样式
const OverallGoalTitle = styled.h2`
  color: rgba(219, 234, 254, 0.95);
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;
  
  svg {
    margin-right: 12px;
    color: #a855f7;
  }
`;

// 修改：整体目标内容样式
const OverallGoalContent = styled.p`
  color: #FFD700;
  font-size: 16px;
  line-height: 1.8;
  margin: 0;
  padding: 15px 20px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  border-left: 4px solid #a855f7;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, 
      rgba(168, 85, 247, 0.1),
      rgba(139, 92, 246, 0.05),
      rgba(99, 102, 241, 0.1)
    );
    pointer-events: none;
  }
`;

// 新增：目标图标组件
const GoalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 40px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 30px;
    justify-content: space-between;
  }
`;

const QuarterAndGoalContainer = styled.div`
  flex: 1;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(71, 85, 105, 0.3);
  padding: 20px;
`;

const TechnologySelectorContainer = styled.div`
  width: 100%;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(71, 85, 105, 0.3);
  padding: 20px;
  
  @media (min-width: 768px) {
    width: 300px;
  }
`;

const SectionDivider = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: block;
    width: 1px;
    align-self: stretch;
    background: linear-gradient(to bottom, transparent, rgba(139, 92, 246, 0.3), transparent);
  }
`;

const QuarterGoalContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const QuarterGoalTitle = styled.h3`
  color: rgba(219, 234, 254, 0.9);
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  display: flex;
  align-items: center;
  font-family: 'Michelin Unit Titling', 'Orbitron', sans-serif;
  
  &::before {
    content: '';
    display: inline-block;
    width: 15px;
    height: 2px;
    background: linear-gradient(90deg, #a855f7, transparent);
    margin-right: 8px;
  }
`;

const QuarterGoalText = styled.p`
  color: #FFD700;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  padding: 10px;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 8px;
  border-left: 2px solid rgba(139, 92, 246, 0.5);
  font-family: 'Michelin Unit Titling', 'Orbitron', sans-serif;
  font-weight: bold;
`;

const KeyCapabilitiesContainer = styled.div`
  margin-top: 10px;
`;

const KeyCapabilitiesTitle = styled.div`
  font-size: 14px;
  color: rgba(219, 234, 254, 0.8);
  margin-bottom: 8px;
  font-family: 'Noto Sans', sans-serif;
`;

const KeyCapabilityTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const KeyCapabilityTag = styled.span`
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
  color: rgba(219, 234, 254, 0.9);
  display: inline-flex;
  align-items: center;
  font-family: 'Noto Sans', sans-serif;
  
  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.7);
    margin-right: 6px;
  }
`;

const TechnicalStudyContainer = styled.div`
  margin-top: 15px;
`;

const TechnicalStudyTitle = styled.div`
  font-size: 14px;
  color: rgba(219, 234, 254, 0.8);
  margin-bottom: 8px;
  font-family: 'Noto Sans', sans-serif;
`;

const TechnicalStudyList = styled.ul`
  margin: 0;
  padding-left: 20px;
`;

const TechnicalStudyItem = styled.li`
  color: rgba(203, 213, 225, 0.9);
  font-size: 13px;
  margin-bottom: 5px;
  font-family: 'Noto Sans', sans-serif;
`;

// 辅助函数：获取多语言文本
const getLocalizedText = (textObj, language) => {
  if (!textObj) return '';
  if (typeof textObj === 'string') return textObj;
  return language === 'zh' ? (textObj.zh || '') : (textObj.en || '');
};

const TechRoadmap = ({ roadmapData, language }) => {
  const [activeQuarter, setActiveQuarter] = useState('');
  const [activeTech, setActiveTech] = useState('all');
  const [currentQuarterData, setCurrentQuarterData] = useState(null);

  // 从路线图数据中提取所有技术类型
  const extractTechnologies = () => {
    const techList = [
      'VUE3',
      'LangChain',
      'FastAPI',
      'Springboot',
      'AzureGPT4o',
      'AzureGPT4oMini',
      'BGE',
      'Milvus',
      'CaaS',
      'Redis',
      'ElasticSearch',
      'Celery',
      'OSS',
      'MySQL'
    ];
    return techList;
  };

  const technologies = extractTechnologies();
  console.log('Technologies:', technologies);

  // 初始化激活的季度
  useEffect(() => {
    if (roadmapData && roadmapData.quarters && roadmapData.quarters.length > 0) {
      setActiveQuarter(roadmapData.quarters[0].id);
    }
  }, [roadmapData]);

  // 当季度变化时更新当前季度数据
  useEffect(() => {
    if (activeQuarter && roadmapData) {
      const quarterData = roadmapData.quarters.find(q => q.id === activeQuarter);
      setCurrentQuarterData(quarterData);
    }
  }, [activeQuarter, roadmapData]);

  if (!roadmapData || !currentQuarterData) {
    return (
      <div style={{ padding: '20px', color: '#f0f9ff', textAlign: 'center' }}>
        {language === 'zh' ? '加载中...' : 'Loading...'}
      </div>
    );
  }

  const hasQuarterTechnicalStudy = currentQuarterData.quarterTechnicalStudy &&
    currentQuarterData.quarterTechnicalStudy.length > 0;

  return (
    <RoadmapContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <OverallGoalContainer>
        <OverallGoalTitle>
          <GoalIcon />
          {language === 'zh' ? '整体目标' : 'Overall Goal'}
        </OverallGoalTitle>
        <OverallGoalContent>
          {getLocalizedText(roadmapData.overallGoal, language)}
        </OverallGoalContent>
      </OverallGoalContainer>
      <RoadmapTimeline language={language} />
      <FiltersContainer>
        <QuarterAndGoalContainer>
          <QuarterSelector
            quarters={roadmapData.quarters}
            activeQuarter={activeQuarter}
            setActiveQuarter={setActiveQuarter}
            language={language}
          />

          <SectionDivider />

          <QuarterGoalContainer>
            <QuarterGoalTitle>
              {language === 'zh' ? '季度目标' : 'Quarter Goal'}
            </QuarterGoalTitle>
            <QuarterGoalText>
              {getLocalizedText(currentQuarterData.quarterGoal, language)}
            </QuarterGoalText>

            <KeyCapabilitiesContainer>
              <KeyCapabilitiesTitle>
                {language === 'zh' ? '关键能力' : 'Key Capabilities'}
              </KeyCapabilitiesTitle>
              <KeyCapabilityTags>
                {currentQuarterData.keyCapabilities.map((capability, index) => (
                  <KeyCapabilityTag key={index}>
                    {getLocalizedText(capability, language)}
                  </KeyCapabilityTag>
                ))}
              </KeyCapabilityTags>
            </KeyCapabilitiesContainer>

            {hasQuarterTechnicalStudy && (
              <TechnicalStudyContainer>
                <TechnicalStudyTitle>
                  {language === 'zh' ? '技术研究' : 'Technical Study'}
                </TechnicalStudyTitle>
                <TechnicalStudyList>
                  {currentQuarterData.quarterTechnicalStudy.map((study, index) => (
                    <TechnicalStudyItem key={index}>
                      {getLocalizedText(study.content, language)}
                    </TechnicalStudyItem>
                  ))}
                </TechnicalStudyList>
              </TechnicalStudyContainer>
            )}
          </QuarterGoalContainer>
        </QuarterAndGoalContainer>

        <TechnologySelectorContainer>
          <TechnologySelector
            technologies={technologies}
            activeTech={activeTech}
            setActiveTech={setActiveTech}
            language={language}
          />
        </TechnologySelectorContainer>
      </FiltersContainer>

      <motion.div
        key={activeQuarter}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {currentQuarterData.monthlyPlans.map((month) => (
          <MonthlyPlan
            key={month.id}
            month={month}
            activeTech={activeTech}
            language={language}
          />
        ))}
      </motion.div>
    </RoadmapContainer>
  );
};

export default TechRoadmap; 