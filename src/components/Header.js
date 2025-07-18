import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeaderContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--gradient-blue);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  z-index: 100;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LogoHexagon = styled.div`
  width: 40px;
  height: 46px;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 40 46' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 11.5V34.5L20 46L0 34.5V11.5L20 0Z' fill='%232563eb' fill-opacity='0.3'/%3E%3Cpath d='M20 0L40 11.5V34.5L20 46L0 34.5V11.5L20 0Z' stroke='%232563eb' stroke-width='1'/%3E%3Cpath d='M20 13L27 17V25L20 29L13 25V17L20 13Z' fill='%232563eb' fill-opacity='0.5' stroke='%2300ffff' stroke-width='1'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-tech);
  font-weight: bold;
  color: var(--neon-blue);
  font-size: 10px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 0;
  
  span {
    background: var(--gradient-neon);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SubTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LanguageToggle = styled(motion.button)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 8px 16px;
  border-radius: 30px;
  cursor: pointer;
  font-family: var(--font-tech);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--neon-blue);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }
`;

const FlexLine = styled(motion.div)`
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    var(--neon-blue) 20%, 
    var(--neon-purple) 50%, 
    var(--neon-pink) 80%, 
    transparent 100%
  );
`;

const Header = ({ language, toggleLanguage }) => {
    return (
        <HeaderContainer
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
        >
            <Logo>
                <LogoHexagon>GAI</LogoHexagon>
                <Title>
                    <MainTitle>
                        GAI <span>PLATFORM</span>
                    </MainTitle>
                    <SubTitle>
                        {language === 'zh' ? '技术能力路线图' : 'Technology Roadmap'}
                    </SubTitle>
                </Title>
            </Logo>

            <Controls>
                <LanguageToggle
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleLanguage}
                >
                    {language === 'zh' ? 'ENGLISH' : '中文'}
                </LanguageToggle>
            </Controls>

            <FlexLine
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            />
        </HeaderContainer>
    );
};

export default Header; 