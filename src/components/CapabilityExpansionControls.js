import React from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  position: absolute;
  top: 1rem;
  right: 3.5rem;
`;

const ControlButton = styled.button`
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: #ffffff;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

/**
 * 能力地图卡片展开控制组件
 * @param {Object} props 组件属性
 * @param {Function} props.onExpandAll 全部展开的回调函数
 * @param {Function} props.onCollapseAll 全部收起的回调函数
 * @param {string} props.language 当前语言
 * @returns {JSX.Element} 渲染的组件
 */
const CapabilityExpansionControls = ({ onExpandAll, onCollapseAll, language }) => {
  return (
    <ControlsContainer>
      <ControlButton onClick={onExpandAll}>
        <span>⬇️</span>
        {language === 'zh' ? '全部展开' : 'Expand All'}
      </ControlButton>
      <ControlButton onClick={onCollapseAll}>
        <span>⬆️</span>
        {language === 'zh' ? '全部收起' : 'Collapse All'}
      </ControlButton>
    </ControlsContainer>
  );
};

export default CapabilityExpansionControls; 