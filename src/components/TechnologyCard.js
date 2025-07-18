import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CardContainer = styled(motion.div)`
  position: relative;
  background: rgba(13, 21, 45, 0.7);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  width: 280px;
  min-height: 180px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  box-shadow: 0 0 15px rgba(147, 51, 234, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(139, 92, 246, 0.6);
    box-shadow: 0 0 25px rgba(147, 51, 234, 0.4), 
                0 0 5px rgba(245, 208, 254, 0.4) inset;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(224, 231, 255, 0.05), rgba(147, 51, 234, 0.01));
    pointer-events: none;
  }
`;

const CardBorder = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, transparent, transparent, transparent,
      rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1), transparent
    );
    transform: translateX(-100%);
    animation: shimmer 4s infinite;
  }
  
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
`;

const CardTitle = styled.h3`
  color: #f0f9ff;
  font-size: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  line-height: 1.4;
  font-family: 'Open Sans', sans-serif;
  font-weight: bold;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 10px;
    border-radius: 50%;
    background: #a855f7;
    box-shadow: 0 0 10px rgba(168, 85, 247, 0.7);
  }
`;

const CardContent = styled.div`
  color: rgba(219, 234, 254, 0.8);
  font-size: 14px;
  line-height: 1.5;
  font-family: 'Open Sans', sans-serif;
  font-weight: normal;
`;

const DetailsButton = styled.button`
  background: transparent;
  border: none;
  color: #a855f7;
  font-size: 13px;
  margin-top: 10px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
  font-family: 'Open Sans', sans-serif;
  
  &:hover {
    color: #d8b4fe;
  }
  
  &::after {
    content: '→';
    margin-left: 4px;
    transition: transform 0.3s ease;
  }
  
  &:hover::after {
    transform: translateX(4px);
  }
`;

const DetailsList = styled(motion.div)`
  margin-top: 15px;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  padding-top: 12px;
`;

const DetailsItem = styled.div`
  font-size: 13px;
  color: rgba(219, 234, 254, 0.7);
  margin-bottom: 8px;
  padding-left: 10px;
  position: relative;
  font-family: 'Open Sans', sans-serif;
  
  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #a855f7;
  }
`;

const TechnologyCard = ({ id, content, technicalImplementation = [], technicalStudy = [], language = 'zh' }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const hasDetails = technicalImplementation.length > 0 || technicalStudy.length > 0;

  // 处理content可能是对象的情况
  const getContentText = () => {
    // 如果content是对象且有语言键
    if (content && typeof content === 'object' && (content.zh || content.en)) {
      return language === 'zh' ? content.zh : content.en;
    }
    // 如果content是字符串
    return typeof content === 'string' ? content : '';
  };

  const contentText = getContentText();

  // 处理标题和描述
  let titleText = '';
  let descriptionText = '';

  if (contentText.includes('→')) {
    const parts = contentText.split('→');
    titleText = parts[0].trim();
    descriptionText = parts[1].trim();
  } else {
    titleText = contentText;
  }

  return (
    <CardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardBorder />
      <CardTitle>
        {id}. {titleText}
      </CardTitle>
      {descriptionText && (
        <CardContent>
          {descriptionText}
        </CardContent>
      )}

      {hasDetails && (
        <DetailsButton onClick={toggleDetails}>
          {language === 'zh' ? '查看技术详情' : 'View Technical Details'}
        </DetailsButton>
      )}

      {showDetails && hasDetails && (
        <DetailsList
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          {technicalImplementation.length > 0 && (
            <>
              <DetailsItem style={{ color: '#a855f7', fontWeight: 'bold' }}>
                {language === 'zh' ? '技术实现' : 'Technical Implementation'}
              </DetailsItem>
              {technicalImplementation.map((item, index) => (
                <DetailsItem key={`impl-${index}`}>
                  {typeof item === 'object' ? (language === 'zh' ? item.zh : item.en) : item}
                </DetailsItem>
              ))}
            </>
          )}

          {technicalStudy.length > 0 && (
            <>
              <DetailsItem style={{ color: '#a855f7', fontWeight: 'bold', marginTop: '10px' }}>
                {language === 'zh' ? '技术研究' : 'Technical Study'}
              </DetailsItem>
              {technicalStudy.map((item, index) => (
                <DetailsItem key={`study-${index}`}>
                  {typeof item === 'object' ? (language === 'zh' ? item.zh : item.en) : item}
                </DetailsItem>
              ))}
            </>
          )}
        </DetailsList>
      )}
    </CardContainer>
  );
};

export default TechnologyCard; 