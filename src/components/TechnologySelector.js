import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
`;

const SelectorTitle = styled.h3`
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

const TechnologiesRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
  
  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(30, 41, 59, 0.4);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(139, 92, 246, 0.5);
    }
  }
`;

const TechButton = styled(motion.button)`
  background: ${props => props.$isActive ? 'rgba(139, 92, 246, 0.2)' : 'rgba(30, 41, 59, 0.4)'};
  border: 1px solid ${props => props.$isActive ? 'rgba(139, 92, 246, 0.6)' : 'rgba(71, 85, 105, 0.3)'};
  border-radius: 20px;
  color: ${props => props.$isActive ? '#f0f9ff' : 'rgba(203, 213, 225, 0.8)'};
  font-size: 13px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  font-family: 'Noto Sans', sans-serif;
  width: calc(50% - 4px); /* 每行显示两个标签 */
  margin-bottom: 8px;
  justify-content: center;
  
  &:hover {
    background: rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.4);
    color: #f0f9ff;
    transform: translateY(-1px);
  }
  
  ${props => props.$isActive && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(120deg, rgba(139, 92, 246, 0.1), rgba(30, 64, 175, 0.1));
      z-index: -1;
    }
  `}
`;

const TechIcon = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  background: ${props => {
        switch (props.type) {
            case 'all':
                return 'linear-gradient(to right, #8b5cf6, #ec4899)';
            case 'VUE3':
                return '#41B883';
            case 'LangChain':
                return '#00A3E0';
            case 'FastAPI':
                return '#009688';
            case 'Springboot':
                return '#6DB33F';
            case 'AzureGPT4o':
            case 'AzureGPT4oMini':
                return '#0078D4';
            case 'BGE':
                return '#FF6B6B';
            case 'Milvus':
                return '#00A0E9';
            case 'CaaS':
                return '#326CE5';
            case 'Redis':
                return '#DC382D';
            case 'ElasticSearch':
                return '#005571';
            case 'Celery':
                return '#37814A';
            case 'OSS':
                return '#FF9900';
            case 'MySQL':
                return '#4479A1';
            default:
                return '#8b5cf6';
        }
    }};
  box-shadow: 0 0 5px ${props => {
        switch (props.type) {
            case 'VUE3':
                return 'rgba(65, 184, 131, 0.5)';
            case 'LangChain':
                return 'rgba(0, 163, 224, 0.5)';
            case 'FastAPI':
                return 'rgba(0, 150, 136, 0.5)';
            case 'Springboot':
                return 'rgba(109, 179, 63, 0.5)';
            case 'AzureGPT4o':
            case 'AzureGPT4oMini':
                return 'rgba(0, 120, 212, 0.5)';
            case 'BGE':
                return 'rgba(255, 107, 107, 0.5)';
            case 'Milvus':
                return 'rgba(0, 160, 233, 0.5)';
            case 'CaaS':
                return 'rgba(50, 108, 229, 0.5)';
            case 'Redis':
                return 'rgba(220, 56, 45, 0.5)';
            case 'ElasticSearch':
                return 'rgba(0, 85, 113, 0.5)';
            case 'Celery':
                return 'rgba(55, 129, 74, 0.5)';
            case 'OSS':
                return 'rgba(255, 153, 0, 0.5)';
            case 'MySQL':
                return 'rgba(68, 121, 161, 0.5)';
            default:
                return 'rgba(139, 92, 246, 0.5)';
        }
    }};
`;

const getTechTranslation = (tech, language) => {
    const translations = {
        all: { en: 'All', zh: '全部' },
        VUE3: { en: 'VUE3', zh: 'VUE3' },
        LangChain: { en: 'LangChain', zh: 'LangChain' },
        FastAPI: { en: 'FastAPI', zh: 'FastAPI' },
        Springboot: { en: 'SpringBoot', zh: 'SpringBoot' },
        AzureGPT4o: { en: 'Azure GPT-4o', zh: 'Azure GPT-4o' },
        AzureGPT4oMini: { en: 'GPT-4o-mini', zh: 'GPT-4o-mini' },
        BGE: { en: 'BGE', zh: 'BGE' },
        Milvus: { en: 'Milvus', zh: 'Milvus' },
        CaaS: { en: 'CaaS', zh: 'CaaS' },
        Redis: { en: 'Redis', zh: 'Redis' },
        ElasticSearch: { en: 'ElasticSearch', zh: 'ElasticSearch' },
        Celery: { en: 'Celery', zh: 'Celery' },
        OSS: { en: 'OSS', zh: 'OSS' },
        MySQL: { en: 'MySQL', zh: 'MySQL' }
    };

    return translations[tech] ? translations[tech][language] : tech;
};

const TechnologySelector = ({ technologies, activeTech, setActiveTech, language }) => {
    const techList = ['all', ...technologies];

    return (
        <SelectorContainer>
            <SelectorTitle>{language === 'zh' ? '技术领域' : 'Technology Domain'}</SelectorTitle>
            <TechnologiesRow>
                {techList.map((tech) => (
                    <TechButton
                        key={tech}
                        $isActive={activeTech === tech}
                        onClick={() => setActiveTech(tech)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <TechIcon type={tech} />
                        {getTechTranslation(tech, language)}
                    </TechButton>
                ))}
            </TechnologiesRow>
        </SelectorContainer>
    );
};

export default TechnologySelector; 