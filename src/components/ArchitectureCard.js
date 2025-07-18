import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import CapabilityMapModal from './CapabilityMapModal';
import { getCapabilityMap } from '../services/capabilityMapService';

const glowAnimation = `
  0% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.2); }
  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.4); }
  100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.2); }
`;

const Card = styled(motion.div)`
  background: ${props => props.color || 'rgba(30, 41, 59, 0.8)'};
  padding: 1.5rem;
  border-radius: 12px;
  position: relative;
  overflow: visible;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(99, 102, 241, 0.2);
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      rgba(99, 102, 241, 0.8),
      rgba(168, 85, 247, 0.8)
    );
    border-radius: 12px 12px 0 0;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    border-color: rgba(99, 102, 241, 0.4);
    
    &::before {
      opacity: 1;
    }
    
    .card-actions {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CardContent = styled.div`
  color: rgba(219, 234, 254, 0.95);
  font-size: 1rem;
  text-align: center;
  line-height: 1.6;
  position: relative;
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg,
      transparent,
      rgba(99, 102, 241, 0.6),
      transparent
    );
  }
`;

const CardActions = styled(motion.div)`
  position: absolute;
  top: -35px;
  right: 10px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(30, 41, 59, 0.95);
  padding: 6px 12px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  backdrop-filter: blur(8px);
`;

const ActionIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  transition: all 0.2s ease;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 50%;
    transform: scale(0);
    transition: transform 0.2s ease;
  }
  
  &:hover {
    color: #4f46e5;
    transform: scale(1.1);
    
    &::before {
      transform: scale(1);
    }
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const StatusIndicator = styled(motion.div)`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? '#10B981' : '#6B7280'};
  box-shadow: 0 0 10px ${props => props.active ? 'rgba(16, 185, 129, 0.4)' : 'rgba(107, 114, 128, 0.4)'};
`;

const ArchitectureCard = ({ card, language, sectionId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capabilityMapData, setCapabilityMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (card.capabilityMapRef) {
      setIsLoading(true);
      const [refSectionId, refCardId] = card.capabilityMapRef.split('/');
      getCapabilityMap(refSectionId || sectionId, refCardId || card.id)
        .then(mapData => {
          if (mapData) {
            setCapabilityMapData(mapData);
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error(`加载能力地图数据出错:`, error);
          setIsLoading(false);
        });
    }
  }, [card, sectionId]);

  const handleViewCapabilityMap = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const hasCapabilityMap = !!card.capabilityMap || !!capabilityMapData || !!card.capabilityMapRef;

  return (
    <>
      <Card
        color={card.color}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <StatusIndicator
          active={hasCapabilityMap}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />

        <CardContent>
          {card.content[language]}
        </CardContent>

        {hasCapabilityMap && (
          <CardActions className="card-actions">
            <ActionIcon
              onClick={handleViewCapabilityMap}
              title={language === 'zh' ? '查看能力地图' : 'View Capability Map'}
            >
              {isLoading ? '⏳' : '📊'}
            </ActionIcon>
          </CardActions>
        )}
      </Card>

      <AnimatePresence>
        {isModalOpen && (
          <CapabilityMapModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            capabilityMap={card.capabilityMap}
            capabilityMapRef={card.capabilityMapRef}
            sectionId={sectionId}
            cardId={card.id}
            language={language}
            cardTitle={card.content}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ArchitectureCard; 