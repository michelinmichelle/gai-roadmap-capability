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

const QuartersRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const QuarterButton = styled(motion.button)`
  background: ${props => props.$isActive ? 'rgba(139, 92, 246, 0.2)' : 'rgba(30, 41, 59, 0.4)'};
  border: 1px solid ${props => props.$isActive ? 'rgba(139, 92, 246, 0.6)' : 'rgba(71, 85, 105, 0.3)'};
  border-radius: 6px;
  color: ${props => props.$isActive ? '#f0f9ff' : 'rgba(203, 213, 225, 0.8)'};
  font-size: 14px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  font-family: 'Noto Sans', sans-serif;
  
  &:hover {
    background: rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.4);
    color: #f0f9ff;
  }
  
  ${props => props.$isActive && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, #8b5cf6, #6366f1);
    }
  `}
`;

const DetailText = styled.div`
  font-size: 13px;
  color: rgba(203, 213, 225, 0.6);
  margin-top: 5px;
  font-style: italic;
  font-family: 'Noto Sans', sans-serif;
`;

const QuarterId = styled.span`
  font-family: 'Michelin Unit Titling', 'Orbitron', sans-serif;
  font-weight: bold;
  display: block;
`;

const QuarterSelector = ({ quarters, activeQuarter, setActiveQuarter, language }) => {
  return (
    <SelectorContainer>
      <SelectorTitle>{language === 'zh' ? '季度视图' : 'Quarter View'}</SelectorTitle>
      <QuartersRow>
        {quarters.map((quarter) => (
          <QuarterButton
            key={quarter.id}
            $isActive={activeQuarter === quarter.id}
            onClick={() => setActiveQuarter(quarter.id)}
            whileTap={{ scale: 0.97 }}
          >
            <QuarterId>{quarter.id}</QuarterId>
            <DetailText>{quarter.period}</DetailText>
          </QuarterButton>
        ))}
      </QuartersRow>
    </SelectorContainer>
  );
};

export default QuarterSelector; 