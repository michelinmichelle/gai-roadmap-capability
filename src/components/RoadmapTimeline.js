import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(139, 92, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
  }
`;

const rippleAnimation = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.5;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.8;
  }
`;

const TimelineContainer = styled.div`
  margin: 40px 0;
  padding: 20px;
  position: relative;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(71, 85, 105, 0.3);
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 20px;
    background: linear-gradient(to bottom,
      rgba(139, 92, 246, 0.5),
      transparent
    );
  }
`;

const TimelinePeriod = styled.h3`
  color: #FFD700;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  padding: 12px 30px;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 30px;
  font-family: 'Michelin Unit Titling', 'Orbitron', sans-serif;
  letter-spacing: 1px;
  box-shadow: 0 4px 20px rgba(168, 85, 247, 0.3);
  border: 2px solid rgba(139, 92, 246, 0.5);
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
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg,
      transparent,
      rgba(139, 92, 246, 0.5),
      transparent
    );
  }
`;

const TimelinePath = styled.div`
  position: absolute;
  top: 50%;
  left: 50px;
  right: 50px;
  height: 4px;
  background: linear-gradient(90deg, 
    rgba(139, 92, 246, 0.3),
    rgba(99, 102, 241, 0.3),
    rgba(168, 85, 247, 0.3)
  );
  transform: translateY(-50%);
  border-radius: 2px;
`;

const StagesContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const Stage = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const StageOrb = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  animation: ${pulseAnimation} 2s infinite, ${floatAnimation} 6s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.1);
    animation: ${rippleAnimation} 3s infinite;
    animation-delay: ${props => props.$delay}s;
  }

  &::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.3);
    filter: blur(8px);
  }
`;

const StageIcon = styled.div`
  color: #f0f9ff;
  font-size: 24px;
  z-index: 1;
`;

const StageTitle = styled.h3`
  color: #f0f9ff;
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  text-align: center;
  font-family: 'Michelin Unit Titling', 'Orbitron', sans-serif;
`;

const StageDescription = styled.div`
  color: rgba(219, 234, 254, 0.9);
  font-size: 14px;
  text-align: center;
  max-width: 200px;
  line-height: 1.4;
`;

const RoadmapTimeline = ({ language }) => {
    const stages = [
        {
            icon: '🎯',
            title: language === 'zh' ? '标准化体验' : 'Standardized Experience',
            description: language === 'zh'
                ? '打造标准化AI交互平台，提升用户体验'
                : 'Build standardized AI platform, enhance UX'
        },
        {
            icon: '🔍',
            title: language === 'zh' ? '智能决策' : 'Intelligent Decision',
            description: language === 'zh'
                ? '实现精准知识访问和动态决策'
                : 'Enable precise knowledge access and dynamic decisions'
        },
        {
            icon: '🔮',
            title: language === 'zh' ? '多模态处理' : 'Multimodal Processing',
            description: language === 'zh'
                ? '增强多模态处理与数据可视化'
                : 'Enhance multimodal processing and visualization'
        },
        {
            icon: '🚀',
            title: language === 'zh' ? '系统可靠性' : 'System Reliability',
            description: language === 'zh'
                ? '提升系统稳定性和安全性'
                : 'Improve system stability and security'
        }
    ];

    return (
        <TimelineContainer>
            <TimelineHeader>
                <TimelinePeriod>
                    {language === 'zh' ? '规划周期: 24Q3 - 25Q3' : 'Planning Period: 24Q3 - 25Q3'}
                </TimelinePeriod>
            </TimelineHeader>
            <TimelinePath />
            <StagesContainer>
                {stages.map((stage, index) => (
                    <Stage
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                    >
                        <StageOrb $delay={index * 0.5}>
                            <StageIcon>{stage.icon}</StageIcon>
                        </StageOrb>
                        <StageTitle>{stage.title}</StageTitle>
                        <StageDescription>{stage.description}</StageDescription>
                    </Stage>
                ))}
            </StagesContainer>
        </TimelineContainer>
    );
};

export default RoadmapTimeline; 