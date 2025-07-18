import styled from 'styled-components';
import { motion } from 'framer-motion';
import { pulse, float, glow } from '../animations/matrixAnimations';

// 主容器
export const MatrixContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(26, 26, 26, 0.8);
  border-radius: 12px;
  color: #ffffff;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

// 标题与描述
export const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #ffffff;
  font-size: 1.8rem;
`;

export const Description = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

// 表格样式
export const MatrixTable = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-bottom: 2rem;
  
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

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 4px;
  min-width: ${props => props.columnCount ? `${props.columnCount * 120}px` : 'auto'};
`;

export const TableHeader = styled.th`
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  border-radius: 6px;
  font-size: 0.9rem;
  width: ${props => props.isFirstColumn ? '180px' : '120px'};
`;

export const TableCell = styled.td`
  padding: 10px;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:first-child {
    text-align: left;
    background: rgba(255, 255, 255, 0.08);
    font-weight: 500;
    font-size: 0.95rem;
  }
`;

// 状态指示器
export const StatusSymbol = styled.span`
  display: inline-block;
  font-size: 1.6rem;
  transition: transform 0.3s ease;
  
  ${props => props.status === '✅' && `
    color: #10b981; 
    text-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
    &:hover { transform: scale(1.2); }
  `}
  
  ${props => props.status === '⚠️' && `
    color: #f59e0b;
    text-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
    &:hover { transform: scale(1.2) rotate(10deg); }
  `}
  
  ${props => props.status === '❌' && `
    color: #ef4444;
    text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
    &:hover { transform: scale(1.2) rotate(-10deg); }
  `}
`;

export const TooltipContent = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.95);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
  
  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: rgba(15, 23, 42, 0.95) transparent transparent transparent;
  }
`;

export const StatusContainer = styled.div`
  position: relative;
  display: inline-block;
  
  &:hover ${TooltipContent} {
    opacity: 1;
    transform: translateX(-50%) translateY(-5px);
  }
`;

// 导航元素
export const MatrixNavigation = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const MatrixButton = styled(motion.button)`
  padding: 0.6rem 1rem;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  transition: background 0.3s, transform 0.2s;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  }
`;

export const SubMatrixButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const SubMatrixButton = styled(motion.button)`
  padding: 0.4rem 0.8rem;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.07)'};
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.3s;
`;

// 图例样式
export const Legend = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

export const LegendSymbol = styled.span`
  font-size: 1.2rem;
`;

// 加载状态样式
export const LoadingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 100%;
`;

export const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  margin-bottom: 20px;
`;

export const LoadingText = styled.div`
  color: white;
  font-size: 1.2rem;
`;

// 错误状态样式
export const ErrorContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: white;
  text-align: center;
`;

export const ErrorIcon = styled.div`
  font-size: 2.5rem;
  color: #ef4444;
  margin-bottom: 15px;
`;

export const ErrorMessage = styled.div`
  font-size: 1.1rem;
  max-width: 500px;
`;

// 动画效果样式
export const PulseContainer = styled.div`
  animation: ${pulse} 2s ease-in-out infinite;
`;

export const GlowingContainer = styled.div`
  animation: ${glow} 3s ease-in-out infinite;
`; 